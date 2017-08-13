class Node(object):
    def __init__(self, data=None, next_node=None):
        self.data = data
        self.next = next_node

def tail_insert_iterative(head, data):
    node = Node(data)
    if head:
        current = head
        while current.next:
            current = current.next
        current.next = node
    else:
        head = node
    return head

print tail_insert_iterative(None,2)

# def tail_insert_recursive(head, data):
#     if not head:
#         return Node(data)
#     else:
#         if head.next:
#             tail_insert_recursive(head.next, data)
#         else:
#             head.next = Node(data, None)
#         return head
