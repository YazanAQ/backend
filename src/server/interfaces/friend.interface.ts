import { FRIEND_STATUS } from "../../database";
import User from "../../database/orm/models/user.model";
import UserFriends from "../../database/orm/models/userFriends.model";

interface FriendArgsI {
  userId: string;
  friendId: string;
}

interface FriendSearch {
  name?: string;
  email?: string;
}

interface FriendResponseI {
  user: User;
}

interface AcceptOrAbortFriendship {
  userId: string;
  friendId: string;
  status: FRIEND_STATUS;
}

interface FriendServiceInterface {
  addFriend(addFriendArgsI: FriendArgsI): Promise<FriendResponseI>;
  removeFriend(removeFriend: FriendArgsI): Promise<FriendResponseI>;
  search(friendSearch: FriendSearch): Promise<FriendResponseI>;
  fetchAbortedFriends({ id }: { id: string }): Promise<UserFriends[]>;
  fetchAcceptedFriends({ id }: { id: string }): Promise<UserFriends[]>;
  fetchPendingFriends({ id }: { id: string }): Promise<UserFriends[]>;
  acceptOrAbortFriendship(
    acceptOrAbortFriendship: AcceptOrAbortFriendship
  ): Promise<FriendResponseI>;
}

export {
  AcceptOrAbortFriendship,
  FriendArgsI,
  FriendResponseI,
  FriendSearch,
  FriendServiceInterface,
};
