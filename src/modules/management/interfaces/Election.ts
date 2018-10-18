export interface Election {
    id: number
    title: string
    candidateNames?: string
    codes?:string[]
    voteCount?:number
    isActive: boolean
}
