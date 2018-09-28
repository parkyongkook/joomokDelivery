import * as AppType from './ActionTypes';

export function drinkListUpdate(drinkListData){
	return {
		type : AppType.DRINK_LIST_UPDATE,
		drinkListData : drinkListData
	}
}

export function cartListUpdate(cartListData){
	return {
		type : AppType.CART_LIST_UPDATE,
		cartListData : cartListData
	}
}

export function reOrderProductUpdate(reorderList){
	return {
		type : AppType.REORDER_PRODUCT_UPDATE,
		reorderList : reorderList
	}
}

export function cartListDelete(id){
	return {
		type : AppType.CART_LIST_DELETE,
		id : id
	}
}

export function updateTocartListData( idx, qty, cartType ){
	return {
		type : AppType.CART_LIST_QTY_UPDATE,
		idx : idx,
		qty : qty,
		cartType : cartType
	}
}

export function loginSucess(userData , usridx, displayInfo){
	return {
		type : AppType.LOGIN_SUCESS,
		userData : userData,
		usridx : usridx,
		displayInfo : displayInfo
	}
}
















