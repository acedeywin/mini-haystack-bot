import { Probot } from "probot"
import { timeDifference } from "./utils"

export = (app: Probot) => {
  const openedPR = "pull_request.opened"
  const closedPR = "pull_request.closed"
  const completedWorkflowRun = "workflow_run.completed"
  const editedpR = "pull_request.edited"

  //Add the label "Haystack" to the pull request if PR has the title "Haystack"
  app.on(openedPR, async context => {
    try {
      const pullRequest = context.payload.pull_request

      let labels: any

      if (pullRequest.title.includes("Haystack")) {
        labels = ["Haystack"]
      }

      const addLabelToPR = context.issue({ labels })

      return await context.octokit.issues.addLabels(addLabelToPR)
    } catch (error) {
      throw error
    }
  })

  //Add the label "Haystack" to an edited pull request if PR has the title "Haystack"
  app.on(editedpR, async context => {
    try {
      const pullRequest = context.payload.pull_request

      let labels: any

      if (pullRequest.title.includes("Haystack")) {
        labels = ["Haystack"]
      }

      const addLabelToPR = context.issue({ labels })

      return await context.octokit.issues.addLabels(addLabelToPR)
    } catch (error) {
      throw error
    }
  })

  //Calculate the average pull request size to the repository and add a comment to the pull request automatically
  app.on(openedPR, async context => {
    try {
      const owner = context.payload.repository.owner.login
      const repo = context.payload.repository.name

      const listPR = await context.octokit.rest.pulls.list({ owner, repo })

      const size = listPR.data.map(list => {
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
  app.on(closedPR, async context => {
    try {
      if (context.payload.pull_request.merged) {
        const closedAt: any = context.payload.pull_request.closed_at
        const createdAt = context.payload.pull_request.created_at

        const addTimeDifference = context.issue({
          body: `This pr took ${timeDifference(
            createdAt,
            closedAt
          )} to complete`,
        })

        return await context.octokit.issues.createComment(addTimeDifference)
      }
    } catch (error) {
      throw error
    }
  })

  //Sleeps 10 to 20 seconds randomly after pull request push
  app.on(completedWorkflowRun, async context => {
    const updatedAt: any = context.payload.workflow_run?.updated_at
    const randomNumber = Math.floor(Math.random() * 19) + 10
    const time: any = randomNumber * 1000

    if (
      context.payload.workflow_run?.event === "push" &&
      context.payload.workflow_run?.updated_at === updatedAt
    ) {
      return await new Promise(resolve => setTimeout(resolve, time))
    }
    console.log(`Slept for ${time} seconds`)
  })

  //Add a comment to the PR everytime the CI runs
  app.on(completedWorkflowRun, async context => {
    try {
      const createdAt: any = context.payload.workflow_run?.created_at
      const updatedAt: any = context.payload.workflow_run?.updated_at
      const id = context.payload.workflow_run?.id

      if (context.payload.workflow_run?.event === "pull_request") {
        app.on(closedPR, async context => {
          const CIRunsComment = context.issue({
            body: `The CI ${id} took ${timeDifference(createdAt, updatedAt)}`,
          })

          return await context.octokit.issues.createComment(CIRunsComment)
        })
      }
    } catch (error) {
      throw error
    }
  })
}
