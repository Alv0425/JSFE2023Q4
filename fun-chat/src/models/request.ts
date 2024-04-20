export interface IUserRequest {
  login: string;
  password: string;
}

export interface IMessageRequest {
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

export interface IRequest {
  id: string | null;
  type: string;
  payload: {
    user?: IUserRequest;
    message?: IMessageRequest;
  } | null;
}

export interface IRequestHistory {
  id: string | null;
  type: string;
  payload: {
    user?: {
      login: string;
    };
    message?: IMessageRequest;
  } | null;
}

export interface IRequestSend {
  id: string;
  type: string;
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
}
