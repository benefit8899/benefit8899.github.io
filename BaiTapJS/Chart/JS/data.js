var Rank = {
    "Xuất sắc": 4,
    "Tốt": 6,
    "Trung bình": 5,
    "Kém": 3
};
function Project(name, level) {
    this.nameProject = name;
    this.levelOfPosition = level;
    return this;
}
//create data list project
var lstProject = [
    new Project('A', 0),
    new Project('B', 4),
    new Project('C', 1),
    new Project('D', 3),
    new Project('E', 4),
    new Project('F', 4),
    new Project('F', 5),
    new Project('F', 6),
    new Project('F', 4),
    new Project('F', 4),
    new Project('F', 4),
    new Project('F', 4),
    new Project('F', 7),
    new Project('F', 1),
    new Project('F', 1),
    new Project('F', 1),
    new Project('F', 4),
    new Project('F', 4),
    new Project('G', 4)];