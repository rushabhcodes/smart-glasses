// Manufacturer-listed bounding volumes, not detailed cell models or an assembly.
// See docs/assembly-candidates.md. No fit, material or electrical approval implied.
pack = "jauch1900";
length = pack == "jauch1900" ? 52.0 : pack == "jauch2050" ? 84.5 : 38.5;
width = pack == "jauch1900" ? 34.5 : pack == "jauch2050" ? 47.5 : 18.5;
thickness = pack == "jauch1900" ? 10.0 : pack == "jauch2050" ? 5.2 : 5.6;
assert(pack == "jauch1900" || pack == "jauch2050" || pack == "jauch350");
cube([length,width,thickness]);
echo(pack=pack, listed_body_mm=[length,width,thickness],
     selected=false, frame_fit_verified=false);
