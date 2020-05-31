const globby = require('globby')
const got = require('got')

function checkEnvVariables(env) {
  if (!env.GITHUB_TOKEN) {
    console.error('Cannot find environment variable GITHUB_TOKEN')
    process.exit(1)
  }

  if (!env.GITHUB_REPOSITORY) {
    console.error('Cannot find environment variable GITHUB_REPOSITORY')
    process.exit(1)
  }

  if (!env.GITHUB_SHA && !env.GH_SHA) {
    console.error('Cannot find environment variable GITHUB_SHA')
    process.exit(1)
  }
}

checkEnvVariables(process.env)

const envOptions = {
  token: process.env.GITHUB_TOKEN,
  repository: process.env.GITHUB_REPOSITORY,
  // allow overriding the commit SHA, useful in pull requests
  // where we want a merged commit SHA from GH event
  sha: process.env.GH_SHA || process.env.GITHUB_SHA
}

async function setGitHubCommitStatus(diffsN, envOptions) {
  if (diffsN < 0) {
    throw new Error(`Number of visual diffs ${diffsN} cannot be negative`)
  }
  // REST call to GitHub API
  // https://developer.github.com/v3/repos/statuses/
  // https://help.github.com/en/actions/configuring-and-managing-workflows/authenticating-with-the-github_token#example-calling-the-rest-api
  // a typical request would be like:
  // curl --request POST \
  // --url https://api.github.com/repos/${{ github.repository }}/statuses/${{ github.sha }} \
  // --header 'authorization: Bearer ${{ secrets.GITHUB_TOKEN }}' \
  // --header 'content-type: application/json' \
  // --data '{
  //     "state": "success",
  //     "description": "REST commit status",
  //     "context": "a test"
  //   }'
  const url = `https://api.github.com/repos/${envOptions.repository}/statuses/${envOptions.sha}`
  if (diffsN === 0) {
    // @ts-ignore
    await got.post(url, {
      headers: {
        authorization: `Bearer ${envOptions.token}`
      },
      json: {
        context: 'snapshots',
        state: 'success',
        description: 'No visual snapshot diffs'
      }
    })
  } else if (diffsN > 0) {
    // @ts-ignore
    await got.post(url, {
      headers: {
        authorization: `Bearer ${envOptions.token}`
      },
      json: {
        context: 'snapshots',
        state: 'failure',
        description: `${diffsN} visual diffs`
      }
    })
  }
}

async function getVisualDiffs() {
  return globby('cypress/snapshots/**/__diff_output__/**.png')
}

const onError = (e) => {
  console.error(e)
  process.exit(1)
}

getVisualDiffs().then(list => {
  console.log('found %d visual diff(s)', list.length)
  console.log(list.join('\n'))

  return setGitHubCommitStatus(list.length, envOptions)
}).catch(onError)
