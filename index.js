'use strict'

const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')
const {promisify} = require('util')
const fs = require('fs')

fs.readFileAsync = promisify(fs.readFile)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://visual-no-ar.firebaseio.com/'
})

let campaign = '5c64544dd1f07400165e7ca2'

let start = new Date().getTime()

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

function circle(times) {
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

            coordinates.longitude = toFixed(20 * Math.cos(2 * Math.PI * times / 100), 6)
            coordinates.latitude = toFixed(20 * Math.sin(2 * Math.PI * times / 100), 6)

            coordinates.description = (times % 5 === 0) ? 'City, State 1' : 'Jonas, State 2'
    
            waitAndDo(times - 1)
        }, 1000)
    }
}

async function file() {
    try {
        let buffer = await fs.readFileAsync('./history.json')
        let list = JSON.parse(buffer)
        let keys = Object.keys(list)
        let first = list[keys[0]]
        let base = first.timestamp

        for(let i = 0; i < keys.length; i++) {
            let coordinates = list[keys[i]]
            let ms = (coordinates.timestamp - base)
            base = coordinates.timestamp

            await ((coordinates, ms) => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        coordinates.description = 'City, State 1'

                        location.set(coordinates)

                        console.log(JSON.stringify(coordinates))
            
                        resolve()
                    }, ms)
                })
            })(coordinates, ms)
        }
    } catch(err) {
        console.error(err)
    }

    admin.app().delete()
}

//circle(1000)

file()