// Parameterized provisional board carriers, not a validated glasses frame.
// Dimensions derive from current review outlines. External battery/camera,
// RF plug, wiring, fasteners, hinge and acoustic interfaces are unresolved.
// openscad -D 'side="main"' -D 'part="tray"' -o main-tray.stl board-carriers.scad
side = "main";              // "main" or "secondary"
part = "assembly";          // "tray", "lid", "assembly"
board_length = side == "main" ? 80 : 100;
board_width = 18;
pcb_thickness = 1.6;         // provisional; actual stack-up not selected
clearance_xy = 0.4;          // per edge; untested fabrication/fit tolerance
bottom_clearance = 0.6;
top_clearance = side == "main" ? 6 : 12; // provisional external-connector space
wall = 1.2;
floor_thickness = 1.2;
lid_thickness = 1.2;
show_reference_board = true;
exploded_lid_gap = 8;

assert(side == "main" || side == "secondary");
assert(board_length > 0 && board_width > 0 && clearance_xy > 0);
assert(wall >= 1 && floor_thickness >= 1 && top_clearance > 0);
inner_l = board_length + 2*clearance_xy;
inner_w = board_width + 2*clearance_xy;
outer_l = inner_l + 2*wall;
outer_w = inner_w + 2*wall;
cavity_h = bottom_clearance + pcb_thickness + top_clearance;
tray_h = floor_thickness + cavity_h;

module tray() {
  difference() {
    cube([outer_l, outer_w, tray_h]);
    translate([wall, wall, floor_thickness])
      cube([inner_l, inner_w, cavity_h + 0.1]);
  }
  // Narrow nonconductive ledges. PCB edge/component clearance is unverified.
  for (y = [wall, outer_w-wall-1])
    translate([wall, y, floor_thickness])
      cube([inner_l, 1, bottom_clearance]);
}
module lid() { cube([outer_l, outer_w, lid_thickness]); }
module reference_board() {
  // Bounding box only: no missing component bodies are invented.
  color([0.1,0.35,0.2,0.55])
    translate([wall+clearance_xy, wall+clearance_xy, floor_thickness+bottom_clearance])
      cube([board_length,board_width,pcb_thickness]);
}
if (part == "tray") tray();
else if (part == "lid") lid();
else if (part == "assembly") {
  color([0.72,0.78,0.85]) tray();
  if (show_reference_board) reference_board();
  color([0.8,0.84,0.9,0.65]) translate([0,0,tray_h+exploded_lid_gap]) lid();
}
else assert(false,"Unknown part");
echo(side=side, outer_mm=[outer_l,outer_w,tray_h+lid_thickness],
     PCB_mm=[board_length,board_width,pcb_thickness], frame_fit_verified=false);
