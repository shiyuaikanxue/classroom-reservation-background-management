import http from "@/api";
import { ReservationStatus } from "@/views/reservation/constants";
//预约管理模块
export function getAllReservations(params: any) {
  return http.get("/reservation", params);
}

//删除预约记录
export function deleteReservation(id: number) {
  return http.delete(`/reservation/${id}`);
}
//同意预约
export function approveReservation(id: number) {
  return http.put(`/reservation/${id}`, { status: ReservationStatus.已同意 });
}

//驳回预约
export function rejectReservation(id: number) {
  return http.put(`/reservation/${id}`, { status: ReservationStatus.已同意 });
}
