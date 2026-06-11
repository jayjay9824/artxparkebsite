// The pinned `three` build ships no TypeScript types and the migration plan
// forbids installing extra packages (incl. @types/three). The 3D scene is a
// faithful 1:1 port of the concept's vanilla r128 script, so an ambient `any`
// module is sufficient here.
declare module "three";
