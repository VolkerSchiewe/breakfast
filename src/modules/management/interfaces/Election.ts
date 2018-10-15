export interface Election {
    id: number
    name: string
    candidateNames?: string
    codes?:string[]
    voteCount?:number
    isActive: boolean
}
