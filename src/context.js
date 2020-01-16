// context handle the state of the data consumed for the components in the app

import React, {Component} from "react";
import items from './data';

//creation of the context object
const RoomContext = React.createContext();

//class component
export default class RoomProvider extends Component {

	//initial state of memory in the app
	state={
		rooms:[],
		sortedRooms:[],
		featuredRooms:[],
		loading: true,
		type: 'all',
		capacity: 1,
		price: 0,
		//values for the filter logic
		minPrice: 0,
		maxPrice: 0,
		minSize: 0,
		maxSize: 0,
		breakfast: false,
		pets: false
	};

	// creation of vars with the data after request
	componentDidMount(){
		//this.getData();
		let rooms = this.formData(items);
		//console.log(rooms);
		let featuredRooms = rooms.filter(room => room.featured === true);

		let maxPrice = Math.max(...rooms.map(item => item.price));
		let maxSize = Math.max(...rooms.map(item => item.size));

		this.setState({
			rooms,
			featuredRooms,
			sortedRooms: rooms,
			loading: false,
			price: maxPrice,
			maxPrice,
			maxSize
		})
	}  

	// format of the data request
	formData(items){
		let tempItems = items.map(item => {
			let id = item.sys.id;
			let images = item.fields.images.map(image => 
				image.fields.file.url);

			let room = {...item.fields, images, id};
			return room;  
		});
		return tempItems
	}

	// get unique rooom for the single of the rooms
	getRoom = (slug) => {
		let tempRooms = [...this.state.rooms];
		const room = tempRooms.find(room => room.slug === slug);
		return room;
	}

	// callback for passing any option selected in the inputs fields on the filters room
	handleChange = event => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = event.target.name;
		this.setState({
			[name]:value
		},this.filterRooms)
	}

	// filter through items with the specific value
	filterRooms = () => {
		let {
			rooms,
			type,
			capacity,
			price,
			minSize,
			maxSize,
			breakfast,
			pets
		} = this.state;

		// all the rooms object
		let tempRooms = [...rooms];

		// transform the values of string (needed) to numbers
		capacity = parseInt(capacity);
		price = parseInt(price);

		// filter of "types" of room for the list items in the select field 
		if(type !== 'all'){
			tempRooms = tempRooms.filter(room => room.type === type);
		}

		// filter of "capacity" of room for the list items in the select field 
		if(capacity !== 1){
			tempRooms = tempRooms.filter(room => room.capacity >= capacity);
		}	

		// filter of "price" of room for the list items in the select field
		tempRooms = tempRooms.filter(room => room.price <= price);

		// filter of "size" of room for the list items in the select field
		tempRooms = tempRooms.filter(room => room.size >= minSize && room.size <= maxSize);

		// filter of "breakfast" of room for the list items in the select field
		if(breakfast){
			tempRooms = tempRooms.filter(room => room.breakfast === true);
		}

		// filter of "pets" of room for the list items in the select field
		if(pets){
			tempRooms = tempRooms.filter(room => room.pets === true);
		}

		// set the new values in "sortedRooms" in state
		this.setState({
			sortedRooms: tempRooms
		})	
	};

	render(){
		return (
			//context component creation with the values after logic (result data) 
			<RoomContext.Provider value = {{
				...this.state, 
				getRoom: this.getRoom, 
				handleChange: this.handleChange
			}}>
				{this.props.children}
			</RoomContext.Provider>
		);	
	}
}	

const RoomConsumer = RoomContext.Consumer;

//HIGH ORDER FUNCTION FOR CREATION AND PASSING PROPS, AND VALUE AFTER LOGIC (RESULT DATA) TO ANY COMPONENT IN THE APP
export function withRoomConsumer(Component){
	return function ConsumerWrapper(props){
		return <RoomConsumer>
			{value => <Component {...props} context={value}/>}
		</RoomConsumer>
	}
}
//END HIGH ORDER FUNCTION

export {RoomProvider, RoomConsumer, RoomContext};