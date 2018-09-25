
import {TurtleWriter} from "./interfaces"

export const turtleWrite: TurtleWriter = async({website, dist}) => {
	console.log(dist, website)
}
