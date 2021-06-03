export const timeDifference = (createdAt: string, closedAt: string) => {
  const a = new Date(createdAt).getTime()
  const b = new Date(closedAt).getTime()

  const milliseconds = b - a
  const seconds = Math.round(milliseconds / 1000)
  const minutes = Math.round(milliseconds / 60 / 1000)
  const hours = Math.round(milliseconds / 3600 / 1000)
  const newMinutes = minutes - 60 * hours

  let time: any

  switch (true) {
    case hours > 0:
      time = `${hours} hours ${newMinutes} minutes`
      break
    case newMinutes > 0 && seconds <= 59:
      time = `${newMinutes} minutes ${seconds} seconds`
      break
    case newMinutes > 0 && seconds > 59:
      time = `${newMinutes} minutes`
      break
    default:
      time = `${seconds} seconds`
  }
  return time
}
