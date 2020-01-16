import React from "react";
import RoomFilter from "./RoomFilter";
import RoomList from "./RoomList";
import { withRoomConsumer } from "../context";
import Loading from "./Loading";


//WITH HIGH ORDER FUNCTION
function RoomContainer({context}){
	const {loading,sortedRooms,rooms} = context;

	if(loading){
		return <Loading />;
	}
	return(
		<>
			<RoomFilter rooms={rooms} />
			<RoomList rooms={sortedRooms} />
		</>
	);
}

export default withRoomConsumer(RoomContainer);

// WITH CONTEXT VALUE

// import React from "react";
// import RoomsFilter from "./RoomsFilter";
// import RoomsList from "./RoomsList";
// import { RoomConsumer } from "../context";
// import Loading from "./Loading";

// export default function RoomContainer() {
// 	return(

// 		<RoomConsumer>
// 			{value => {
// 				const {loading,sortedRooms,rooms} = value
// 				//console.log(value);
// 				if(loading){
// 					return <Loading />;
// 				}
// 				return(
// 					<div>
// 						hello from room container
// 						<RoomsFilter rooms={rooms} />
// 						<RoomsList rooms={sortedRooms} />
// 					</div>
// 				);
// 			}}
// 		</RoomConsumer>	
		
// 	);
// }