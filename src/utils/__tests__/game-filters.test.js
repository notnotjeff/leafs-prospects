import { gameIsToday, gameWasYesterday } from '../game-filters'

describe('gameIsToday', () => {
  it('only returns games with todays date', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date(Date.parse('2020-05-14T11:01:58.135Z')).valueOf())

    const games = [{ date: '2020-06-20T11:01:58.135Z' }, { date: '2020-05-14T11:01:58.135Z' }]
    const todaysGames = games.filter(gameIsToday)

    expect(todaysGames.length).toBe(1)
  })

  it('does not return the game if the date is null', () => {
    const spy = jest.spyOn(global.Date, 'now')
    const games = [{ date: null }, { date: undefined }]
    const todaysGames = games.filter(gameIsToday)

    expect(todaysGames.length).toBe(0)
    expect(spy).toHaveBeenCalledTimes(0)
  })
})

describe('gameWasYesterday', () => {
  it('only returns games with yesterdays date', () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date(Date.parse('2020-05-15T11:01:58.135Z')).valueOf())

    const games = [{ date: '2020-06-20T11:01:58.135Z' }, { date: '2020-05-14T11:01:58.135Z' }]
    const yesterdaysGames = games.filter(gameWasYesterday)

    expect(yesterdaysGames.length).toBe(1)
  })

  it('does not return the game if the date is null', () => {
    const spy = jest.spyOn(global.Date, 'now')
    const games = [{ date: null }, { date: undefined }]
    const yesterdaysGames = games.filter(gameWasYesterday)

    expect(yesterdaysGames.length).toBe(0)
    expect(spy).toHaveBeenCalledTimes(0)
  })
})
