import { prisma } from "./lib/prisma.js";
const deletarTask = await prisma.task.deleteMany();
const deletarUser = await prisma.user.deleteMany();
console.log(deletarTask, deletarUser);
//# sourceMappingURL=deleteBase.js.map