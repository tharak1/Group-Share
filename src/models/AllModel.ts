interface UserModel{
    _id?:string;
    name:string;
    email:string;
    phoneNo:string;
    password:string;
    isAdmin:boolean;
    joinedGroups?:joinedGroupsModel[]
}

interface cred{
    email:string;
    password:string;
}

interface joinedGroupsModel{
    name:string;
    groupId:string;
    groupProfile:string
}


interface GroupMember {
    name: string;
    email: string;
    userID: string;
    phoneNo: string;
  }
  
  interface GroupContent {
    title: string;
    sentBy: string;
    fileAddress: string;
    otherData: string;
    dateSent: string;
  }
  
  interface TimedGroupContent {
    title: string;
    sentBy: string;
    fileAddress: string;
    otherData: string;
    dateToBeSentOn: string;
  }
  
  interface Group {
    _id?:string;
    groupAdminID: string;
    groupName: string;
    groupProfile:string;
    groupMembers: GroupMember[];
    groupContent: GroupContent[];
    timedGroupContent: TimedGroupContent[];
  }
  


export type {UserModel,cred,joinedGroupsModel,Group,GroupContent,TimedGroupContent,GroupMember};


