# **THIS IS AN UNOFFICIAL API FOR ANIMETRENDINGZ** #
## **Dont't use for commercial purpose. Thank you!!** ##

### **Targets:** ###
- You want to get current top like animes, male/female characters, OP/ED Songs.
- You want also to get specified season top like above.
- You want to ... (will be expanded api more)


### **Usage:** ###
```javascript
const animeTrendingzAPI = require('animetrenz-api')

animeTrendingzAPI.getCurrentTopAnimes(3, 'asc')
  .then(data => console.log(data))
  .catch(e => console.error(e))
```


### **Result:** ###
```javascript
[
  {
    name: 'Mobile Suit Gundam the Witch from Mercury',
    alternativeName: 'Mobile Suit Gundam: Suisei no Majo',
    studio: 'SUNRISE',
    totalVote: 1673,
    timesInTopTenOfASeason: 9,
    images: {
      large: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-FrepbCCWBer2JrfeGgmc_1024?alt=media&token=2b34afb9-58bd-46ca-95a4-dc9623a33aa2',
      full: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-FrepbCCWBer2JrfeGgmc_full?alt=media&token=14977ab1-f107-42db-a402-8c1530668b89',
      medium: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-FrepbCCWBer2JrfeGgmc_256?alt=media&token=169622d1-d1e8-4fcf-9752-e5f68f1668db',
      small: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-FrepbCCWBer2JrfeGgmc_128?alt=media&token=d29dd736-453b-4833-8676-61d89de99c29'
    },
    week: 11,
    season: 'fall',
    currentPosition: 3,
    previousPosition: 1
  },
  {
    name: 'BOCCHI THE ROCK!',
    alternativeName: 'BOCCHI THE ROCK!',
    studio: 'CloverWorks',
    totalVote: 2125,
    timesInTopTenOfASeason: 11,
    images: {
      full: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-vh9SMtX1w9pKk1N7nMyw_full?alt=media&token=84afd71f-9c25-420b-8a1a-e7a99f4adfc2',
      medium: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-vh9SMtX1w9pKk1N7nMyw_256?alt=media&token=bc41d92e-f41b-41f4-bcfc-515ab4e3633f',
      large: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-vh9SMtX1w9pKk1N7nMyw_1024?alt=media&token=5d5d0721-4963-4554-9fd6-197b59227057',
      small: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-vh9SMtX1w9pKk1N7nMyw_128?alt=media&token=4cace04d-4e37-417e-a49b-80e53a1fb348'
    },
    week: 11,
    season: 'fall',
    currentPosition: 2,
    previousPosition: 2
  },
  {
    name: 'Mob Psycho 100 III',
    alternativeName: 'Mob Psycho 100 III',
    studio: 'Bones',
    totalVote: 2419,
    timesInTopTenOfASeason: 11,
    images: {
      full: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-90b7GkjEBMjUvwExPV2A_full?alt=media&token=f8feb1f0-65e3-43d1-a2fa-d0ab0b5b8dbb',
      small: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-90b7GkjEBMjUvwExPV2A_128?alt=media&token=88573749-c409-4aaf-a2c3-e5fac48ace29',
      medium: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-90b7GkjEBMjUvwExPV2A_256?alt=media&token=9c85ccf2-930c-4194-8c95-6930b9294e2e',
      large: 'https://firebasestorage.googleapis.com/v0/b/anitrendz-prod.appspot.com/o/charts%2FxnZOYhYxivim5EjWrOxJ-90b7GkjEBMjUvwExPV2A_1024?alt=media&token=d1775dbe-4c09-4fd0-8690-bccb6c415ef5'
    },
    week: 11,
    season: 'fall',
    currentPosition: 1,
    previousPosition: 3
  }
]
```


### **Other Methods:** ###
- `getCurrentTopMales(limitRank = null, sortType = 'asc') => Array`
- `getCurrentTopFemales(limitRank = null, sortType = 'asc') => Array`
- `getCurrentTopCouples(limitRank = null, sortType = 'asc') => Array`
- `getCurrentTopOpeningSongs(limitRank = null, sortType = 'asc') => Array`
- `getCurrentTopEndingSongs(limitRank = null, sortType = 'asc') => Array`
- `getSpecifiedTopAnimesBasedOnSeason(year, season, week, limitRank = null, sortType = 'asc') => Array`

### **_If you like this project, please give me a star. Thank you_. :kissing_heart::heart_eyes::heart::blue_heart::cupid:** ###