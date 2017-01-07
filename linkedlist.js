
function LinkedList(arr) {
    this.onInsertCallbacks = [];
    this.onRemoveCallbacks = [];
    re(this, 'first');
    re(this, 'last');
    if (arr)
        arr.forEach(function(item) {
            this.append(item)
        }, this);
}
LinkedList.prototype.prepend = function(value) {
    var lli = new LinkedListItem(value, this);
    lli.itemAfter = this.first;
    if (this.first)
        this.first.itemBefore = lli;
    this.first = lli;
    if (!this.last)
        this.last = lli;
    this.triggerOnInsert(lli);
    return lli;
};
LinkedList.prototype.append = function(value) {
    var lli = new LinkedListItem(value, this);
    lli.itemBefore = this.last;
    if (this.last)
        this.last.itemAfter = lli;
    this.last = lli;
    if (!this.first)
        this.first = lli;
    this.triggerOnInsert(lli);
    return lli;
};
LinkedList.prototype.toArray = function() {
    var out = [];
    var node = this.first;
    while (node) {
        out.push(node);
        node = node.itemAfter;
    }
    return out;
};
LinkedList.prototype.onInsert = function(callback) {
    this.onInsertCallbacks.push(callback);
}; 
LinkedList.prototype.triggerOnInsert = function(lli) {
    var cbs = this.onInsertCallbacks;
    cbs.forEach(function(cb) {
        cb(lli)
    });
};
LinkedList.prototype.onRemove = function(callback) {
    this.onRemoveCallbacks.push(callback);
};
LinkedList.prototype.triggerOnRemove = function(lli) {
    var cbs = this.onRemoveCallbacks;
    cbs.forEach(function(cb) {
        cb(lli)
    });
}
LinkedList.prototype.selfCheck = function() {
    if (!this.first != !this.last)
        console.log('first-last issue');
    
    var count = 0;
    
    var lli = this.first;
    while (lli) {
        if (lli.itemAfter && lli.itemAfter.itemBefore !== lli)
            console.log('before after mismatch');
        count++;
        lli = lli.itemAfter;
    }
    
    lli = this.last;
    while(lli) {
        count--;
        lli = lli.itemBefore;
    }
    
    if (count != 0)
        console.log('first to last last to first miscount')
};


function LinkedListItem(value, list) {
    re(this, 'itemBefore');
    re(this, 'itemAfter');
    re(this, 'value');
    this.value = value;
    this.list = list;
}
LinkedListItem.prototype.insert = function(value) {
    var lli = new LinkedListItem(value, this.list);
    lli.itemBefore = this.itemBefore;
    if (this.itemBefore)
        this.itemBefore.itemAfter = lli;
    else
        this.list.first = lli;
    lli.itemAfter = this;
    this.itemBefore = lli;
    this.list.triggerOnInsert(lli);
    return lli;
};
LinkedListItem.prototype.insertAfter = function(value) {
    var lli = new LinkedListItem(vlaue, this.list);
    lli.itemAfter = this.itemAfter;
    if (this.itemAfter)
        this.itemAfter.itemBefore = lli;
    else
        this.list.last = lli;
    lli.itemBefore = this;
    this.itemAfter = lli;
    this.list.triggerOnInsert(lli);
    return lli;
};
LinkedListItem.prototype.remove = function() {
    this.itemPreviouslyAfter = this.itemAfter;
    this.itemPreviouslyBefore = this.itemBefore;
    
    if (this.itemBefore)
        this.itemBefore.itemAfter = this.itemAfter;
    else
        this.list.first = this.itemAfter;
        
    if (this.itemAfter)
        this.itemAfter.itemBefore = this.itemBefore;
    else
        this.list.last = this.itemBefore;
    
    this.itemBefore = null;
    this.itemAfter = null;
    
    this.list.triggerOnRemove(this);
};

