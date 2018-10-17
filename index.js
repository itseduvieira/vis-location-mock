'use strict'

const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://visual-no-ar.firebaseio.com/'
})

let campaign = '5bbebbda9d8c2d8171fc3194'

let coordinates = {
    'latitude': -54.399748,
    'longitude': -69.732339,
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

            let latitude = toFixed((coordinates.latitude + 0.2), 6)

            if(latitude > 89.9) {
                latitude = -89.9
            }

            coordinates.latitude = latitude

            let longitude = toFixed((coordinates.longitude + 0.04), 6)

            if(longitude > 179.9) {
                longitude = -179.9
            }

            coordinates.longitude = longitude

            coordinates.description = (times % 5 === 0) ? 'City, State 1' : 'Jonas, State 2'
    
            waitAndDo(times - 1)
        }, 2500)
    }
}

waitAndDo(100)