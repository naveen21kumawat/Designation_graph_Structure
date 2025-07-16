export function buildTree(employees) {
  const idToNodeMap = {};
  let root = null;

  // Create node objects with attributes
  employees.forEach(emp => {
    idToNodeMap[emp.id] = {
      name: emp.name,
      attributes: {
        role: emp.role,
        image: emp.image,
      },
      children: [],
    };
  });

  // Assign children to parents
  employees.forEach(emp => {
    if (emp.parentId === null) {
      root = idToNodeMap[emp.id];
    } else {
      const parent = idToNodeMap[emp.parentId];
      if (parent) {
        parent.children.push(idToNodeMap[emp.id]);
      }
    }
  });

  return root;
}
