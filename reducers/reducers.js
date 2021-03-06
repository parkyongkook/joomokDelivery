import * as AppType from '../actions/ActionTypes'

const initialState = {
	dateData : null ,
	userData : null,
}

const dateDataUpdate = (state, dateData) => {

	for(let v in dateData){
		dateData[v][0].delData.date = v
	}

	return {
		...state,
		dateData : {
		  ...dateData
		}
	};
}


export default function reducer(state = initialState , action ){
  switch (action.type){
		case AppType.DATE_DATA_UPDATE:
			return dateDataUpdate(state, action.dateData)
		default :	
			return state;	
  }
}







