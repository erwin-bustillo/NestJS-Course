class FriendList{
  friends = [];

  addFriend(name){
    this.friends.push(name);
    this.announce(name);
  }

  announce(name){
    global.console.log(`${name} is now a friend!`);
  }

  removeFriend(name){
    const idx = this.friends.indexOf(name);

    if (idx === -1) {
      throw new Error('Friend not found')
    }

    this.friends.splice(idx,1);
  }
}

// tests
describe('Friendlist',()=>{

  let friendsList;

  beforeEach(()=>{
    friendsList = new FriendList();
  });

  it('Initializes friends list',()=>{
    expect(friendsList.friends.length).toEqual(0);
  });

  it('add a friend to the list',()=>{
    friendsList.addFriend('Erwin');
    expect(friendsList.friends.length).toEqual(1);
  });

  it('Announces frienship',()=>{
    friendsList.announce = jest.fn();
    expect(friendsList.announce).not.toHaveBeenCalled();
    friendsList.addFriend('Erwin');
    expect(friendsList.announce).toHaveBeenCalledWith('Erwin');
  });

  describe('reove friend',()=>{

    it('Remove friend from the list',()=>{
      friendsList.addFriend('Ariel');
      expect(friendsList.friends[0]).toEqual('Ariel');
      friendsList.removeFriend('Ariel');
      expect(friendsList.friends[0]).toBeUndefined();
    });

    it('throws an error as friend does not exist',()=>{
      expect(()=> friendsList.removeFriend('Ariel')).toThrow(Error);
    });
  })
})