class LinkedListNode<T> {
    value: T
    next: LinkedListNode<T>
    prev: LinkedListNode<T>
    constructor(value: T) {
        this.value = value
        this.next = null;
        this.prev = null;
    }
}
export class LinkedList<T>{
    length: number = 0
    head: LinkedListNode<T> = null
    tail: LinkedListNode<T> = null

    // add(t: T): boolean{


}