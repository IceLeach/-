import request from '@/utils/request';

export async function MapPointList() {
  return request('/screen/api/map/pointList', {
    method: 'get',
  });
}

export async function DeviceGetTypeList() {
  return request('/screen/api/device/getTypeList', {
    method: 'get',
  });
}

export async function DeviceGetSumList() {
  return request('/screen/api/device/getSumList', {
    method: 'get',
  });
}

export async function DeviceGetIndexNum() {
  return request('/screen/api/device/getIndexNum', {
    method: 'get',
  });
}

export async function AlarmEventGetLatest() {
  return request('/screen/api/alarmEvent/getLatest', {
    method: 'get',
  });
}

export async function AlarmEventGetSumList() {
  return request('/screen/api/alarmEvent/getSumList', {
    method: 'get',
  });
}

export async function DeviceGetRoomOfDeviceList(params: any) {
  return request(`/screen/api/device/getRoomOfDeviceList`, {
    method: 'post',
    params,
  });
}

export async function DeviceGetPowerOfDevice(params: { id: number }) {
  return request(`/screen/api/device/getPowerOfDevice/${params.id}`, {
    method: 'get',
  });
}

export async function DeviceGetAlarmOfPoint() {
  return request('/screen/api/map/getAlarmOfPoint', {
    method: 'get',
  });
}

export async function DeviceThi() {
  return request('/screen/api/device/thi', {
    method: 'get',
  });
}

export async function MapGetPowerSumList(params: { id: number }) {
  return request(`/screen/api/map/getPowerSumList/${params.id}`, {
    method: 'get',
  });
}
