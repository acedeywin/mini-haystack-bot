import { Probot } from "probot"
import { timeDifference, lowerCase } from "./utils"

export = (app: Probot) => {
  const openedPullRequest = "pull_request.opened"
  const closedPullRequest = "pull_request.closed"
  const completedWorkflowRun = "workflow_run.completed"
  const editedPullRequest = "pull_request.edited"

  //Add the label "Haystack" to the pull request if PR has the title "Haystack"
  app.on(openedPullRequest, async context => {
    try {
      const pullRequest = context.payload.pull_request
      const checkLowerCase = await lowerCase(pullRequest.title)
      const labels = ["Haystack"]
      const addLabelToPullRequest = context.issue({ labels })

      return checkLowerCase.includes("haystack")
        ? await context.octokit.issues.addLabels(addLabelToPullRequest)
        : null
    } catch (error) {
      throw error
    }
  })

  //Add the label "Haystack" to an edited pull request if PR has the title "Haystack"
  app.on(editedPullRequest, async context => {
    try {
      const pullRequest = context.payload.pull_request
      const checkLowerCase = await lowerCase(pullRequest.title)
      const labels = ["Haystack"]
      const addLabelToPullRequest = context.issue({ labels })

      return checkLowerCase.includes("haystack")
        ? await context.octokit.issues.addLabels(addLabelToPullRequest)
        : null
    } catch (error) {
      throw error
    }
  })

  //Calculate the average pull request size to the repository and add a comment to the pull request automatically
  app.on(openedPullRequest, async context => {
    try {
      const owner = context.payload.repository.owner.login
      const repo = context.payload.repository.name

      const listPullRequest = await context.octokit.rest.pulls.list({
        owner,
        repo,
      })

      const size = listPullRequest.data.map(list => {
        return list.number
      })

      const repoSize = context.payload.repository.size
      const additions = context.payload.pull_request.additions
      const deletions = context.payload.pull_request.deletions
      const PRSize = additions + deletions
      const allPRs = size[0]
      const averagePRSize = repoSize / allPRs

      const percentDifference = (averagePRSize: number, PRSize: number) => {
        const percentage =
          100 *
          Math.abs((averagePRSize - PRSize) / ((averagePRSize + PRSize) / 2))

        return Math.round(percentage)
      }

      const body =
        PRSize > averagePRSize
          ? `This pr has ${PRSize} size. It's is ${percentDifference(
              averagePRSize,
              PRSize
            )}% more than the average pr made to this pr.`
          : `This pr has ${PRSize} size. It's is ${percentDifference(
              averagePRSize,
              PRSize
            )}% less than the average pr made to this pr.`

      const addComment = context.issue({ body })

      return await context.octokit.issues.createComment(addComment)
    } catch (error) {
      throw error
    }
  })

  //Add comment automatically to closed PR
  app.on(closedPullRequest, async context => {
    try {
      const closedAt: any = context.payload.pull_request.closed_at
      const createdAt = context.payload.pull_request.created_at

      const addTimeDifference = context.issue({
        body: `This pr took ${await timeDifference(
          createdAt,
          closedAt
        )} to complete`,
      })
      return context.payload.pull_request.merged
        ? await context.octokit.issues.createComment(addTimeDifference)
        : null
    } catch (error) {
      throw error
    }
  })

  //Sleeps 10 to 20 seconds randomly after pull request push
  app.on(completedWorkflowRun, async context => {
    const updatedAt: any = context.payload.workflow_run?.updated_at
    const randomNumber = Math.floor(Math.random() * 19) + 10
    const time: any = randomNumber * 1000

    console.log(`Slept for ${time} seconds`)

    return context.payload.workflow_run?.event === "push" &&
      context.payload.workflow_run?.updated_at === updatedAt
      ? await new Promise(resolve => setTimeout(resolve, time))
      : null
  })

  //Add a comment to the PR everytime the CI runs
  app.on(completedWorkflowRun, async context => {
    try {
      const createdAt: any = context.payload.workflow_run?.created_at
      const updatedAt: any = context.payload.workflow_run?.updated_at
      const id = context.payload.workflow_run?.id

      return context.payload.action === "completed"
        ? app.on(closedPullRequest, async context => {
            const comment = context.issue({
              body: `The CI ${id} took ${await timeDifference(
                createdAt,
                updatedAt
              )}`,
            })

            return await context.octokit.issues.createComment(comment)
          })
        : null
    } catch (error) {
      throw error
    }
  })
}
