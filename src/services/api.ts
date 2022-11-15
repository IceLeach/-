import request from '@/utils/request';

export async function MapPointList() {
  return request('api/map/pointList', {
    method: 'get',
  });
}

export async function MapPointListOfPower() {
  return request('api/map/pointListOfPower', {
    method: 'get',
  });
}

export async function DeviceGetTypeList() {
  return request('api/device/getTypeList', {
    method: 'get',
  });
}

export async function DeviceGetSumList() {
  return request('api/device/getSumList', {
    method: 'get',
  });
}

export async function DeviceGetIndexNum() {
  return request('api/device/getIndexNum', {
    method: 'get',
  });
}

export async function AlarmEventGetLatest() {
  return request('api/alarmEvent/getLatest', {
    method: 'get',
  });
}

export async function AlarmEventGetSumList(params: { type: number }) {
  return request(`api/alarmEvent/getSumList/${params.type}`, {
    method: 'get',
  });
}

export async function DeviceGetRoomOfDeviceList(data: any) {
  return request(`api/device/getRoomOfDeviceList`, {
    method: 'post',
    data,
  });
}

export async function DeviceGetPowerOfDevice(params: { id: number }) {
  return request(`api/device/getPowerOfDevice/${params.id}`, {
    method: 'get',
  });
}

export async function DeviceGetAlarmOfPoint() {
  return request('api/map/getAlarmOfPoint', {
    method: 'get',
  });
}

export async function DeviceThi() {
  return request('api/device/thi', {
    method: 'get',
  });
}

export async function MapGetPowerSumList(params: { id: number; type: number }) {
  return request(`api/map/getPowerSumList/${params.id}/${params.type}`, {
    method: 'get',
  });
}

export async function DeviceGetAlarmOfDevice(params: { id: number }) {
  return request(`api/device/getAlarmOfDevice/${params.id}`, {
    method: 'get',
  });
}

export async function DeviceGetMonitoring(params: { id: number }) {
  return request(`api/device/getMonitoring/${params.id}`, {
    method: 'get',
  });
}

export async function MapGetRunTime() {
  return request('api/map/getRunTime', {
    method: 'get',
  });
}

export async function MapGetPowerType() {
  return request('api/map/getPowerType', {
    method: 'get',
  });
}

export async function Login(data: { loginName: string; password: string }) {
  return request(`api/login`, {
    method: 'post',
    data,
  });
}

export async function UpdatePassword(data: {
  userId?: number;
  oldPassword: string;
  newPassword: string;
}) {
  return request(`api/updatePassword`, {
    method: 'post',
    data,
  });
}
