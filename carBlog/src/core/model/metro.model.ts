export interface MetroLine {
    id: string,
    cityCode: string,
    lineName: string,
    end1: string,
    end2: string,
}


export interface MetroChat {

    id?: string,
    uid: string
    chat: string,
    direction: string,
    image: string,
    lineId: string,
    nickname: string,
    time?: string,
    
}