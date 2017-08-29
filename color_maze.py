"""color maze solution in python"""

sequence = ["O", "G"]
maze = [
    ["B", "O", "R", "O", "Y"],
    ["O", "R", "B", "G", "R"],
    ["B", "O", "G", "O", "Y"],
    ["Y", "G", "B", "Y", "G"],
    ["R", "O", "R", "B", "R"]
]


def get_colors(sequence, i=0):
    while True:
        yield sequence[i % len(sequence)]
        i += 1

def solve(sequence, maze):
    rows = len(maze)
    cols = len(maze[0])

    colors = get_colors(sequence)
    paths = [{'i': rows - 1, 'j': j, 'prev': None}
             for j, _ in enumerate(maze[rows-1])]
    for color in colors:
        paths = [path for path in paths if path['i'] <
                 rows and path['i'] >= 0 and path['j'] < cols and path['j'] >= 0]

        paths = [path for path in paths if maze[path['i']][path['j']] == color]
        acc = [{'di': 1, 'dj': 0},
               {'di': -1, 'dj': 0},
               {'di': 0, 'dj': -1},
               {'di': 0, 'dj': 1}]
        paths = [{'i': path['i'] + dir['di'], 'j': path['j'] +
                  dir['dj'], 'prev':path} for dir in acc for path in paths]
        first_row_paths = filter(lambda path: path['i'] == 0, paths)
        if len(first_row_paths):
            return first_row_paths[0]


final_path = solve(sequence, maze)

def get_path_in_maze(maze, final_path):
    blank = map(lambda x: ['_' for i in x], maze)
    def helper(node):
        blank[node['i']][node['j']] = maze[node['i']][node['j']]
        if node['prev']:
            helper(node['prev'])
    helper(final_path)

    return blank

final_maze =  get_path_in_maze(maze,final_path)
print 'oringinal maze ::\n'
for i in maze:
    print ' '.join(i)
print '\nFinal maze : \n'
for i in final_maze:
    print ' '.join(i)
