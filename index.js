'use strict'

const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://visual-no-ar.firebaseio.com/'
})

<<<<<<< HEAD
let campaign = '5bc1432b3cf2670013274a22'
// let campaign = '5bbebbda9d8c2d8171fc3194'

let start = new Date().getTime()
=======
let campaign = '5bbebbda9d8c2d8171fc3194'
>>>>>>> fd5e6eb960b0d83cb804f99d1c6aee5027618890

let coordinates = {
    'latitude': 0,
    'longitude': 0,
    'altitude': 100,
    'description': 'City, State'
}

let db = admin.database()
let cref = db.ref('/campaign').child(campaign)
let location = cref.child('location')
let active = cref.child('active')

active.set(true)

function toFixed (num, fixed) {
    fixed = fixed || 0;
    fixed = Math.pow(10, fixed);
    return Math.floor(num * fixed) / fixed;
}

function waitAndDo(times) {
    if(times < 1) {
        active.set(false).then(() => {
            location.remove().then(() => {
                admin.app().delete()
            })
        })
    } else {
        setTimeout(function() {
            location.set(coordinates)

            console.log(`set ${times} ${JSON.stringify(coordinates)}`)

            // let latitude = toFixed((coordinates.latitude + 0.2), 6)

            // if(latitude > 89.9) {
            //     latitude = -89.9
            // }

            // coordinates.latitude = latitude

            // let longitude = toFixed((coordinates.longitude + 0.04), 6)

            // if(longitude > 179.9) {
            //     longitude = -179.9
            // }

            // coordinates.longitude = longitude

            // let now = new Date().getTime() - start

            // coordinates.longitude = Math.cos(now) * 20
            // coordinates.latitude = Math.sin(now) * 20

            // coordinates.longitude = toFixed(20 * Math.cos(2 * Math.PI * times / 20), 6)
            // coordinates.latitude = toFixed(20 * Math.sin(2 * Math.PI * times / 20), 6)

            coordinates.longitude = toFixed(20 * Math.cos(2 * Math.PI * times / 100), 6)
            coordinates.latitude = toFixed(20 * Math.sin(2 * Math.PI * times / 100), 6)

            coordinates.description = (times % 5 === 0) ? 'City, State 1' : 'Jonas, State 2'
    
            waitAndDo(times - 1)
        }, 1000)
    }
}

<<<<<<< HEAD
waitAndDo(1000)
=======
waitAndDo(100)
>>>>>>> fd5e6eb960b0d83cb804f99d1c6aee5027618890
