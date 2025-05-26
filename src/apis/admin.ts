import axios from 'axios';
import type { Room, Question } from '../types/index.ts';

export async function getAllRooms(): Promise<Room[]> {
    const res = await axios.get('/api/admin/rooms');
    return res.data.rooms;
}

export async function getAdminRoomDetail(roomId: string): Promise<Question[]> {
    const res = await axios.get(`/api/admin/rooms/${roomId}`);
    return res.data.questions;
}
