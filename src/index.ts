import { Probot } from "probot"

export = (app: Probot) => {
  const openPR = "pull_request.opened"

  app.on(openPR, async context => {
    try {
      const pullRequest = context.payload.pull_request

      let labels: any

      pullRequest.title.includes("Haystack")
        ? (labels = ["Haystack"])
        : (labels = null)

      const addLabelToPR = context.issue({ labels })

      return await context.octokit.issues.addLabels(addLabelToPR)
    } catch (error) {
      throw error
    }
  })

  app.on(openPR, async context => {
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

  app.on("pull_request.closed", async context => {
    try {
      if (context.payload.pull_request.merged) {
        const closedAt: any = context.payload.pull_request.closed_at
        const createdAt = context.payload.pull_request.created_at

        const timeDifference = (createdAt: string, closedAt: string) => {
          const a = new Date(createdAt).getTime()
          const b = new Date(closedAt).getTime()

          const milliseconds = b - a
          const minutes = Math.round(milliseconds / 60 / 1000)
          const hours = Math.round(milliseconds / 3600 / 1000)
          const newMinutes = minutes - 60 * hours

          return hours > 0
            ? `${hours} hours ${newMinutes} minutes`
            : `${newMinutes} minutes`
        }

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
}
