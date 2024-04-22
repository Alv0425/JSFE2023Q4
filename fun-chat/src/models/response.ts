export interface IUserResponse {
  login: string;
  isLogined?: boolean;
}

export interface IMessageResponse {
  id: string;
  from?: string;
  to?: string;
  text?: string;
  datetime?: number;
  status?: {
    isDelivered?: boolean;
    isReaded?: boolean;
    isEdited?: boolean;
    isDeleted?: boolean;
  };
}

export interface IResponse {
  id: string | null;
  type: string;
  payload: {
    user?: IUserResponse;
    error?: string;
    message?: IMessageResponse;
    users?: IUserResponse[];
    messages?: IMessageResponse[];
  };
}
