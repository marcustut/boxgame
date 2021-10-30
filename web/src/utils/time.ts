import Dayjs from 'dayjs'
import RelativeTime from 'dayjs/plugin/relativeTime'

Dayjs.extend(RelativeTime)

export const getDuration = (date1: Dayjs.Dayjs, date2: Dayjs.Dayjs) => {
  const seconds = date2.diff(date1, 'seconds')
  return new Date(seconds * 1000).toISOString().substr(11, 8)
}
