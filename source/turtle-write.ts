
import {TurtleWriter} from "./interfaces"

export const turtleWrite: TurtleWriter = async({websiteOutput, dist}) => {
	console.log(dist, websiteOutput)
}
