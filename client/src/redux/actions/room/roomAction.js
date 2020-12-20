import axios from "axios";
import * as types from "../../types/room/roomType";


export const getRooms = (roomsOnPage, token) =>async dispatch=>{
    axios({
        method: 'get',
        url: 'http://localhost:9999/room',
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }).then((response) => {
        const rooms = response.data.rooms;

        const currentRoomId = localStorage.getItem('currentRoomId');
        const roomsFormated = formatRooms(rooms, currentRoomId);

        if (response.status === 200) {
            dispatch({
                type: types.ROOM_SET,
                rooms: roomsFormated,
            });
            dispatch({
                type: types.ROOM_SET_ACTUAL,
                actualRooms: roomsFormated.slice(0, roomsOnPage),
            });
            dispatch({
                type: types.ROOM_SET_STEP,
                step: roomsOnPage,
            });
        }
    }).catch((error) => {
        console.log(error.response.data.message);
    });
}

export const addUser = (roomId, userId, token) =>async dispatch=>{
    const params = new URLSearchParams();
    params.append('userId', userId);

    dispatch({
        type: types.ROOM_SET_UP_CURRENT_ID,
        id: roomId,
    });

    axios({
        method: 'post',
        url: 'http://localhost:9999/room/' + roomId + '/add-user',
        data: params,
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            dispatch({
                type: types.ROOM_SUCCESS,
                success: true,
            });

            const roomId = response.data.room._id;
            localStorage.setItem('currentRoomId', roomId);
        }
    }).catch((error) => {
        dispatch({
            type: types.ROOM_SET_MESSAGE,
            message: error.response.data.message,
        });
    });
};

export const outUser = (roomId, userId, token) =>async dispatch=>{
    axios({
        method: 'get',
        url: 'http://localhost:9999/room/' + roomId + '/out/' + userId,
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }).then((response) => {

    }).catch((error) => {
        console.log(error.response);
    });
};

export const isBusyUser = (userId, token) =>async dispatch=>{
    axios({
        method: 'get',
        url: 'http://localhost:9999/room/is-user-busy/' + userId,
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    }).then((response) => {
        dispatch({
            type: types.ROOM_SET_USER_BUSY,
            isBusy: response.data.isBusy,
        });
    }).catch((error) => {
        console.log(error.response);
    });
};

export const clearRoomData = () =>async dispatch=>{
    localStorage.removeItem('currentRoomId');
    dispatch({
        type: types.ROOM_SET_UP_CURRENT_ID,
        id: '',
    });
}


const formatRooms = (rooms, currentRoomId) => {
    const roomsFormated = [];

    for (let i = 0; i <= rooms.length - 1; i++) {
        const current = rooms[i];
        if (current._id === currentRoomId) {
            roomsFormated.push(current);
            rooms.splice(i, 1);
        }
    }
    roomsFormated.push(...rooms);
    return roomsFormated;
};
