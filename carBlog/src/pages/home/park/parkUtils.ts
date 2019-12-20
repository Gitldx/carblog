import { SharePark } from "@src/core/model/park";
import { getSearchedShareParks, saveSearchedShareParks, getThankParks, saveThankParks, getRoadChats, saveRoadChat } from "@src/core/uitls/storage/locationStorage";
import { globalFields } from "@src/core/model";
import { object } from "prop-types";
import { isEmpty, timeDiffInSeconds } from "@src/core/uitls/common";

type localSearchedPark = {id:string,time:Date}
type localThankPark = localSearchedPark

declare var global : globalFields

export async function calculateSearchScore(parks:SharePark[]){

    

    const localData : localSearchedPark[] = await getSearchedShareParks()

    // console.warn(`localData : ${JSON.stringify(localData)}`)

    const toDelete : string[] = []

    if(!global.hasInitLocalSearchParksKey){
        global.hasInitLocalSearchParksKey = true
        const now = (new Date()).getDate()
        localData.forEach(l=>{
          
            if(l.time.getDate() != now){
                toDelete.push(l.id)
            }
        })  
    }


    const temp : localSearchedPark[] = []
    let count = 0
    for(let p of parks){
        if(localData.findIndex(l=>l.id == p.id) == -1){
            count++;
            temp.push({id:p.id,time : new Date()})
        }
    }
    // console.warn(`temp:${JSON.stringify(temp)},count:${count}`)

    toDelete.forEach(d=>{
        const index = localData.findIndex(i=>i.id == d)
        localData.splice(index,1)
    })

    const saved = localData.concat(temp)

    saveSearchedShareParks(saved)

    return count
}



export async function hasThanked(parkId : string){

    const localData : localThankPark[] = await getThankParks()

    // console.warn(`localData : ${JSON.stringify(localData)}`)

    const toDelete : string[] = []

    if(!global.hasInitLocalThankParksKey){
        global.hasInitLocalThankParksKey = true
        const now = (new Date()).getDate()
        localData.forEach(l=>{
          
            if(l.time.getDate() != now){
                toDelete.push(l.id)
            }
        })  
    }


    // const temp : localThankPark[] = []
    // let count = 0
    // for(let p of parks){
    //     if(localData.findIndex(l=>l.id == p.id) == -1){
    //         count++;
    //         temp.push({id:p.id,time : new Date()})
    //     }
    // }
    // console.warn(`temp:${JSON.stringify(temp)},count:${count}`)

    toDelete.forEach(d=>{
        const index = localData.findIndex(i=>i.id == d)
        localData.splice(index,1)
    })

    // console.warn(`parkId:${parkId},all:${JSON.stringify(localData)}`)

    if(localData.findIndex(l=>l.id==parkId) != -1){
        return true
    }
    else{
        localData.push({id:parkId,time: new Date()})
        saveThankParks(localData)
        return false
    }
    

    
}

type RoadChat = {road:string,time:Date}

export async function hasOverRoadChat(road:string){
    const chats : RoadChat[] = await getRoadChats()

    if(!isEmpty(chats)){
        const copy : RoadChat[] = Object.assign([],chats)
        for(let i = 0;i<copy.length;i++){
            const minutes = timeDiffInSeconds(new Date(),copy[i].time)/(60)
            if(minutes>=60){
                chats.splice(i,1)
            }
        }
    }


    if(chats.length >=3){
        const c = chats.find(cc=>cc.road == road)
        if(c != null){
            c.time = new Date()
            saveRoadChat(chats)
            return false
        }
        else{
            return true
        }
    }
    else{
        const c = chats.find(cc=>cc.road == road)
        if(c != null){
            c.time = new Date()
            saveRoadChat(chats)
        }
        else{
            chats.push({road,time:new Date()})
            saveRoadChat(chats)
        }
        return false
    }
}