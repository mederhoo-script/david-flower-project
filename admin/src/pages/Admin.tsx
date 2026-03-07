import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { flowers, flowerCategories, FlowerProduct, FlowerCategory, FlowerSeason } from "@/data/products";
import { addProduct, getProducts, deleteProduct, setProduct, uploadProductImage } from "@/lib/productsService";
import {
  getBrandConfig,
  saveBrandConfig,
  resetBrandConfig,
  DEFAULT_BRAND_CONFIG,
  type BrandConfig,
} from "@/lib/brandConfigService";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  type Testimonial,
} from "@/lib/testimonialsService";
import {
  getHeroSlides,
  addHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  uploadHeroSlideImage,
  type HeroSlide,
} from "@/lib/heroSlidesService";
import {
  useHiddenProductIds,
  hideProduct,
  restoreProduct,
} from "@/lib/hiddenProductsService";
import { brand } from "@/config/brand";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Icons (inline SVG) ────────────────────────────────────────────────────────
function Icon({ path, className = "w-5 h-5" }: { path: string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  );
}

const ICONS = {
  dashboard:
    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  products:
    "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  config:
    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  tag: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  trending: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  new: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  phone:
    "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  map: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  link: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
  plus: "M12 4v16m8-8H4",
  logout: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  eyeOff:
    "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
  edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
};

// ── Sidebar navigation ────────────────────────────────────────────────────────
type Section = "dashboard" | "flowers" | "add-flower" | "config" | "testimonials" | "hero-slides";

const NAV_ITEMS: { id: Section; label: string; iconPath: string }[] = [
  { id: "dashboard", label: "Dashboard", iconPath: ICONS.dashboard },
  { id: "flowers", label: "Flowers", iconPath: ICONS.products },
  { id: "add-flower", label: "Add Flower", iconPath: ICONS.plus },
  { id: "testimonials", label: "Testimonials", iconPath: ICONS.star },
  { id: "hero-slides", label: "Hero Slides", iconPath: ICONS.trending },
  { id: "config", label: "Brand Config", iconPath: ICONS.config },
];

// ── Firestore flowers hook ────────────────────────────────────────────────────
function useFirestoreFlowers() {
  const [fsFlowers, setFsFlowers] = useState<FlowerProduct[]>([]);
  const [fsLoading, setFsLoading] = useState(true);
  const [fsError, setFsError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setFsLoading(true);
    setFsError(null);
    try {
      const data = await getProducts();
      setFsFlowers(data);
    } catch (e) {
      setFsError((e as Error).message ?? "Failed to load flowers from Firestore.");
    } finally {
      setFsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const remove = useCallback(
    async (id: string): Promise<void> => {
      await deleteProduct(id);
      await fetch();
    },
    [fetch]
  );

  return { fsFlowers, fsLoading, fsError, refetch: fetch, remove };
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  iconPath,
  accent = false,
}: {
  label: string;
  value: number | string;
  iconPath: string;
  accent?: boolean;
}) {
  return (
    <Card className="border border-border">
      <CardContent className="p-5 space-y-3">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            accent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon path={iconPath} className="w-4 h-4" />
        </div>
        <div>
          <p className="text-3xl font-playfair font-bold leading-none">{value}</p>
          <p className="text-xs text-muted-foreground font-inter tracking-wide uppercase mt-2">
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Dashboard overview ────────────────────────────────────────────────────────
function DashboardSection() {
  const { fsFlowers, fsLoading } = useFirestoreFlowers();
  const totalFlowers = flowers.length;
  const featured = flowers.filter((f) => f.featured).length;
  const isNew = flowers.filter((f) => f.isNew).length;
  const trending = flowers.filter((f) => f.isTrending).length;
  const totalCategories = flowerCategories.length - 1;

  const categoryBreakdown = useMemo(() => {
    const cats = flowerCategories.filter((c) => c !== "All") as Exclude<FlowerCategory, "All">[];
    return cats.map((cat) => ({
      name: cat,
      count: flowers.filter((f) => f.category === cat).length,
    }));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">Dashboard</h2>
        <p className="text-sm text-muted-foreground font-inter">
          Overview of your flower catalogue and brand data.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Flowers" value={totalFlowers} iconPath={ICONS.products} accent />
        <StatCard
          label="Saved to DB"
          value={fsLoading ? "…" : fsFlowers.length}
          iconPath={ICONS.tag}
          accent
        />
        <StatCard label="Featured" value={featured} iconPath={ICONS.star} />
        <StatCard label="New Arrivals" value={isNew} iconPath={ICONS.new} />
        <StatCard label="Trending" value={trending} iconPath={ICONS.trending} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Categories" value={totalCategories} iconPath={ICONS.tag} />
        <StatCard
          label="Firestore Flowers"
          value={fsLoading ? "…" : fsFlowers.length}
          iconPath={ICONS.products}
        />
      </div>

      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-playfair text-lg font-semibold">
            Flowers by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categoryBreakdown.map(({ name, count }) => (
              <div key={name} className="text-center p-4 rounded-lg bg-muted/50">
                <p className="font-playfair text-2xl font-semibold text-primary">{count}</p>
                <p className="text-xs text-muted-foreground font-inter tracking-wide mt-1">
                  {name}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-playfair text-lg font-semibold">
            Recently Added (Static)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {flowers.slice(0, 6).map((f) => (
              <div key={f.id} className="flex items-center gap-3 py-3">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-10 h-10 object-cover rounded-md bg-muted flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm font-medium truncate">{f.title}</p>
                  <p className="font-inter text-xs text-muted-foreground">{f.category}</p>
                </div>
                {f.badge && (
                  <Badge variant="secondary" className="font-inter text-xs">
                    {f.badge}
                  </Badge>
                )}
                <span className="font-inter text-sm text-muted-foreground">{f.stemPrice ? `${f.stemPrice}/stem` : "—"}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Flowers section ───────────────────────────────────────────────────────────
function FlowersSection({ onEdit }: { onEdit: (f: FlowerProduct) => void }) {
  const { fsFlowers, fsLoading, fsError, refetch, remove } = useFirestoreFlowers();
  const { hiddenIds, refetch: refetchHidden } = useHiddenProductIds();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FlowerCategory>("All");

  // Set of static flower IDs that have already been saved to Firestore (overridden)
  const fsIds = useMemo(() => new Set(fsFlowers.map((f) => f.id)), [fsFlowers]);

  const categoryOptions = useMemo(() => {
    const set = new Set(flowers.map((f) => f.category));
    return ["All", ...Array.from(set).sort()] as FlowerCategory[];
  }, []);

  const filtered = useMemo(
    () =>
      flowers.filter((f) => {
        const matchesSearch =
          search === "" ||
          f.title.toLowerCase().includes(search.toLowerCase()) ||
          f.category.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          categoryFilter === "All" || f.category === categoryFilter;
        return matchesSearch && matchesCategory;
      }),
    [search, categoryFilter]
  );

  async function toggleHide(f: FlowerProduct) {
    const isHidden = hiddenIds.includes(f.id);
    const action = isHidden ? "Restore" : "Hide";
    if (
      !window.confirm(
        `${action} "${f.title}" ${
          isHidden ? "so it appears on the storefront again" : "from the storefront"
        }?`
      )
    )
      return;
    try {
      if (isHidden) {
        await restoreProduct(f.id);
      } else {
        await hideProduct(f.id);
      }
      await refetchHidden();
    } catch (e) {
      alert(`Failed: ${(e as Error).message}`);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">Flowers</h2>
        <p className="text-sm text-muted-foreground font-inter">
          Manage your flower catalogue. Click <strong>Edit</strong> on any flower — static or
          Firestore — to update its info, images, and pricing. Edited static flowers are saved to
          Firestore and take priority on the storefront.
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon
            path={ICONS.search}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          />
          <Input
            placeholder="Search flowers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-inter"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as FlowerCategory)}
        >
          <SelectTrigger className="w-full sm:w-52 font-inter">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((c) => (
              <SelectItem key={c} value={c} className="font-inter">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Static flowers table */}
      <Card className="border border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="font-playfair text-base font-semibold">
            Static Catalogue ({filtered.length})
            {fsLoading && (
              <span className="ml-2 font-inter text-xs text-muted-foreground font-normal">
                Loading DB data…
              </span>
            )}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refetch} className="font-inter text-xs">
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-0 relative">
          {fsLoading && (
            <div
              className="absolute inset-0 z-10 bg-background/60 flex items-center justify-center rounded-b-lg"
              aria-label="Loading catalogue data"
              role="status"
            >
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 font-inter">Image</TableHead>
                <TableHead className="font-inter">Title</TableHead>
                <TableHead className="hidden sm:table-cell font-inter">Category</TableHead>
                <TableHead className="hidden md:table-cell font-inter">Stem / Bunch</TableHead>
                <TableHead className="font-inter">Badges</TableHead>
                <TableHead className="font-inter">Visible</TableHead>
                <TableHead className="text-right font-inter">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((f) => {
                const isHidden = hiddenIds.includes(f.id);
                const isOverridden = fsIds.has(f.id);
                // For display, use Firestore data when overridden — it's the authoritative version
                const displayF = isOverridden ? (fsFlowers.find((ff) => ff.id === f.id) ?? f) : f;
                return (
                  <TableRow key={f.id} className={isHidden ? "opacity-50" : ""}>
                    <TableCell>
                      <img
                        src={displayF.image}
                        alt={displayF.title}
                        className="w-10 h-10 object-cover rounded-md bg-muted"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-inter text-sm font-medium">{displayF.title}</p>
                      <p className="font-inter text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {displayF.description}
                      </p>
                      {isOverridden && (
                        <span className="inline-block mt-0.5 font-inter text-[10px] text-primary bg-primary/10 px-1.5 py-px rounded">
                          DB override active
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="font-inter text-xs text-muted-foreground">
                        {displayF.category}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-inter text-sm">
                      {(displayF.stemPrice || displayF.bunchPrice)
                        ? `${displayF.stemPrice ?? "—"} / ${displayF.bunchPrice ?? "—"}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {displayF.badge && (
                          <Badge variant="secondary" className="font-inter text-xs">
                            {displayF.badge}
                          </Badge>
                        )}
                        {displayF.featured && (
                          <Badge variant="outline" className="font-inter text-xs">
                            Featured
                          </Badge>
                        )}
                        {displayF.isNew && (
                          <Badge className="font-inter text-xs bg-emerald-500 text-white border-0">
                            New
                          </Badge>
                        )}
                        {displayF.isTrending && (
                          <Badge className="font-inter text-xs bg-amber-500 text-white border-0">
                            Trending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleHide(displayF)}
                        className={`font-inter text-xs px-2 py-0.5 rounded border transition-colors ${
                          isHidden
                            ? "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            : "border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                        }`}
                      >
                        {isHidden ? "Show" : "Hide"}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => onEdit(displayF)}
                        title="Edit this flower"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon path={ICONS.edit} className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Firestore flowers table */}
      <Card className="border border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="font-playfair text-base font-semibold">
            Firestore Flowers ({fsLoading ? "…" : fsFlowers.length})
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refetch} className="font-inter text-xs">
            Refresh
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {fsLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
          {fsError && (
            <p className="p-4 text-sm text-destructive font-inter">{fsError}</p>
          )}
          {!fsLoading && !fsError && fsFlowers.length === 0 && (
            <p className="p-6 text-sm text-muted-foreground font-inter text-center">
              No flowers saved to Firestore yet. Use "Add Flower" to add one.
            </p>
          )}
          {!fsLoading && fsFlowers.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 font-inter">Image</TableHead>
                  <TableHead className="font-inter">Title</TableHead>
                  <TableHead className="hidden sm:table-cell font-inter">Category</TableHead>
                  <TableHead className="hidden md:table-cell font-inter">Stem / Bunch</TableHead>
                  <TableHead className="hidden sm:table-cell font-inter">Badges</TableHead>
                  <TableHead className="font-inter">Status</TableHead>
                  <TableHead className="text-right font-inter">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fsFlowers.map((f) => {
                  const isFsHidden = hiddenIds.includes(f.id);
                  return (
                  <TableRow key={f.id} className={isFsHidden ? "opacity-50" : ""}>
                    <TableCell>
                      <img
                        src={f.image}
                        alt={f.title}
                        className="w-10 h-10 object-cover rounded-md bg-muted"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-inter text-sm font-medium">{f.title}</p>
                      <p className="font-inter text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {f.description}
                      </p>
                      {f.symbolism && (
                        <p className="font-inter text-xs text-muted-foreground/70 mt-0.5 line-clamp-1 italic">
                          🌿 {f.symbolism}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-inter text-xs text-muted-foreground">
                      {f.category}
                    </TableCell>
                    <TableCell className="hidden md:table-cell font-inter text-sm">
                      {(f.stemPrice || f.bunchPrice)
                        ? `${f.stemPrice ?? "—"} / ${f.bunchPrice ?? "—"}`
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {f.badge && (
                          <Badge variant="secondary" className="font-inter text-xs">
                            {f.badge}
                          </Badge>
                        )}
                        {f.featured && (
                          <Badge variant="outline" className="font-inter text-xs">
                            Featured
                          </Badge>
                        )}
                        {f.isNew && (
                          <Badge className="font-inter text-xs bg-emerald-500 text-white border-0">
                            New
                          </Badge>
                        )}
                        {f.isTrending && (
                          <Badge className="font-inter text-xs bg-amber-500 text-white border-0">
                            Trending
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleHide(f)}
                        className={`font-inter text-xs px-2 py-0.5 rounded border transition-colors ${
                          isFsHidden
                            ? "border-border text-muted-foreground hover:border-primary hover:text-primary"
                            : "border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                        }`}
                      >
                        {isFsHidden ? "Show" : "Hide"}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEdit(f)}
                          title="Edit"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Icon path={ICONS.edit} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              !window.confirm(
                                `Delete "${f.title}"? This cannot be undone.`
                              )
                            )
                              return;
                            try {
                              await remove(f.id);
                            } catch (e) {
                              alert(`Failed to delete: ${(e as Error).message}`);
                            }
                          }}
                          title="Delete"
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Icon path={ICONS.trash} className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Tag chip input ────────────────────────────────────────────────────────────
function TagInput({
  id,
  tags,
  onChange,
  placeholder,
}: {
  id: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  function add(raw: string) {
    const value = raw.trim();
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      add(input);
    } else if (e.key === ",") {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 min-h-[38px] w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm focus-within:ring-1 focus-within:ring-ring">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md text-xs font-inter"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="text-muted-foreground hover:text-foreground leading-none"
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        id={id}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => add(input)}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[80px] bg-transparent outline-none text-sm font-inter placeholder:text-muted-foreground"
      />
    </div>
  );
}

type ImageMode = "url" | "upload";

interface ImageSlotState {
  mode: ImageMode;
  url: string;
  file: File | null;
}

const EMPTY_IMAGE_SLOT: ImageSlotState = { mode: "upload", url: "", file: null };

// ── Dual-mode image slot ──────────────────────────────────────────────────────
function ImageSlot({
  id,
  label,
  required,
  mode,
  url,
  file,
  uploading,
  onModeChange,
  onUrlChange,
  onFileChange,
}: {
  id: string;
  label: string;
  required?: boolean;
  mode: ImageMode;
  url: string;
  file: File | null;
  uploading: boolean;
  onModeChange: (m: ImageMode) => void;
  onUrlChange: (u: string) => void;
  onFileChange: (f: File | null) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const displayedPreview = mode === "upload" ? previewUrl : url || null;
  const hasValue = mode === "url" ? url.trim() !== "" : file !== null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="font-inter text-sm">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        <div className="flex rounded-md border border-border overflow-hidden text-xs font-inter">
          <button
            type="button"
            onClick={() => onModeChange("url")}
            className={`px-3 py-1 transition-colors ${
              mode === "url"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => onModeChange("upload")}
            className={`px-3 py-1 border-l border-border transition-colors ${
              mode === "upload"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === "url" && (
        <Input
          id={id}
          type="text"
          placeholder="/images/david/fiorella.jpeg or https://…"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          className="font-inter text-sm"
          required={required && !hasValue}
        />
      )}

      {mode === "upload" && (
        <div className="flex items-center gap-3">
          <label
            htmlFor={id}
            className={`inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md border border-dashed border-border
              text-xs font-inter text-muted-foreground hover:border-primary hover:text-primary transition-colors
              ${uploading ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Icon path={ICONS.plus} className="w-3 h-3" />
            {file ? "Change file" : "Choose file"}
            <input
              id={id}
              type="file"
              accept="image/*"
              className="sr-only"
              required={required && !hasValue}
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            />
          </label>
          {file && (
            <span className="text-xs font-inter text-muted-foreground truncate max-w-[160px]">
              {file.name}
            </span>
          )}
          {uploading && (
            <span className="text-xs font-inter text-muted-foreground">Uploading…</span>
          )}
        </div>
      )}

      {displayedPreview && (
        <img
          src={displayedPreview}
          alt={label}
          className="h-24 w-24 object-cover rounded-md border border-border bg-muted"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}
    </div>
  );
}

type ImageView = "front" | "left" | "right" | "back";

// ── Add / Edit Flower section ─────────────────────────────────────────────────
const BADGE_OPTIONS = ["New", "Popular", "Trending", "Fragrant", "Premium"] as const;
const CATEGORY_OPTIONS = flowerCategories.filter(
  (c) => c !== "All"
) as Exclude<FlowerCategory, "All">[];
const SEASON_OPTIONS: FlowerSeason[] = [
  "Spring",
  "Summer",
  "Autumn",
  "Winter",
  "All Year",
];

function makeEmptyForm() {
  return {
    title: "",
    description: "",
    symbolism: "",
    stemPrice: "",
    bunchPrice: "",
    stemPriceValue: "",
    bunchPriceValue: "",
    category: CATEGORY_OPTIONS[0],
    badge: "" as "" | "New" | "Popular" | "Trending" | "Fragrant" | "Premium",
    colors: [] as string[],
    seasons: [] as FlowerSeason[],
    featured: false,
    isNew: false,
    isTrending: false,
  };
}

function makeEmptySlots(): Record<ImageView, ImageSlotState> {
  return {
    front: { ...EMPTY_IMAGE_SLOT },
    left: { ...EMPTY_IMAGE_SLOT },
    right: { ...EMPTY_IMAGE_SLOT },
    back: { ...EMPTY_IMAGE_SLOT },
  };
}

function AddFlowerSection({
  editFlower = null,
  onEditDone,
}: {
  editFlower?: FlowerProduct | null;
  onEditDone?: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState(makeEmptyForm);
  const [slots, setSlots] = useState<Record<ImageView, ImageSlotState>>(makeEmptySlots);
  const [uploadingSlot, setUploadingSlot] = useState<ImageView | null>(null);

  // True when editing a flower that originated from the static products.ts list.
  // Computed once per editFlower change, not on every render.
  const isStaticFlower = useMemo(
    () => !!editFlower && flowers.some((f) => f.id === editFlower.id),
    [editFlower]
  );

  // Populate form when editing
  useEffect(() => {
    if (editFlower) {
      setForm({
        title: editFlower.title,
        description: editFlower.description,
        symbolism: editFlower.symbolism ?? "",
        stemPrice: editFlower.stemPrice ?? "",
        bunchPrice: editFlower.bunchPrice ?? "",
        stemPriceValue: String(editFlower.stemPriceValue ?? ""),
        bunchPriceValue: String(editFlower.bunchPriceValue ?? ""),
        category: editFlower.category,
        badge: editFlower.badge ?? "",
        colors: editFlower.colors ?? [],
        seasons: editFlower.seasons ?? [],
        featured: editFlower.featured ?? false,
        isNew: editFlower.isNew ?? false,
        isTrending: editFlower.isTrending ?? false,
      });
      setSlots({
        front: { mode: "url", url: editFlower.images?.front ?? editFlower.image, file: null },
        left: { mode: "url", url: editFlower.images?.left ?? "", file: null },
        right: { mode: "url", url: editFlower.images?.right ?? "", file: null },
        back: { mode: "url", url: editFlower.images?.back ?? "", file: null },
      });
    } else {
      setForm(makeEmptyForm());
      setSlots(makeEmptySlots());
    }
    setSaveError(null);
    setSaveSuccess(false);
  }, [editFlower]);

  function patchSlot(view: ImageView, patch: Partial<ImageSlotState>) {
    setSlots((prev) => ({ ...prev, [view]: { ...prev[view], ...patch } }));
  }

  function handleChange(field: keyof typeof form, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function resolveImage(view: ImageView): Promise<string> {
    const slot = slots[view];
    if (slot.mode === "url") return slot.url;
    if (!slot.file) return "";
    setUploadingSlot(view);
    try {
      const url = await uploadProductImage(slot.file, view);
      patchSlot(view, { url, file: null, mode: "url" });
      return url;
    } finally {
      setUploadingSlot(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);

    try {
      const frontUrl = await resolveImage("front");
      const leftUrl = await resolveImage("left");
      const rightUrl = await resolveImage("right");
      const backUrl = await resolveImage("back");

      // For new flowers the front image is required.
      // For edits it is optional: fall back to the existing image so admins can
      // update text fields without re-entering the image URL.
      if (!frontUrl && !editFlower) {
        setSaveError("Front image is required for new flowers.");
        setSaving(false);
        return;
      }
      const resolvedFrontUrl = frontUrl || editFlower?.image || "";

      const data: Omit<FlowerProduct, "id"> = {
        title: form.title.trim(),
        description: form.description.trim(),
        symbolism: form.symbolism.trim() || undefined,
        stemPrice: form.stemPrice.trim() || undefined,
        bunchPrice: form.bunchPrice.trim() || undefined,
        stemPriceValue: form.stemPriceValue ? Number(form.stemPriceValue) : undefined,
        bunchPriceValue: form.bunchPriceValue ? Number(form.bunchPriceValue) : undefined,
        category: form.category,
        badge: (form.badge as "New" | "Popular" | "Trending" | "Fragrant" | "Premium") || undefined,
        image: resolvedFrontUrl,
        images: {
          front: resolvedFrontUrl,
          ...(leftUrl ? { left: leftUrl } : {}),
          ...(rightUrl ? { right: rightUrl } : {}),
          ...(backUrl ? { back: backUrl } : {}),
        },
        colors: form.colors.length > 0 ? form.colors : undefined,
        seasons: form.seasons.length > 0 ? form.seasons : undefined,
        featured: form.featured || undefined,
        isNew: form.isNew || undefined,
        isTrending: form.isTrending || undefined,
      };

      if (editFlower) {
        // Use setProduct (upsert by ID) so that:
        //  • static flowers (no existing Firestore doc) are created with their static ID
        //  • previously-promoted flowers are fully replaced
        // The storefront's DB-first logic then serves the Firestore version automatically.
        await setProduct(editFlower.id, data);
      } else {
        await addProduct(data);
      }

      setSaveSuccess(true);
      if (onEditDone) {
        onEditDone();
      } else {
        handleReset();
      }
    } catch (e) {
      setSaveError((e as Error).message ?? "Failed to save flower.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm(makeEmptyForm());
    setSlots(makeEmptySlots());
    setSaveError(null);
    setSaveSuccess(false);
  }

  const isEditing = !!editFlower;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">
          {isEditing ? `Edit: ${editFlower!.title}` : "Add Flower"}
        </h2>
        <p className="text-sm text-muted-foreground font-inter">
          {isEditing
            ? isStaticFlower
              ? "Editing a static flower saves an override to Firestore. The storefront will use the Firestore version instead of the static one."
              : "Update this flower in Firestore."
            : "Save a new flower to Firestore. It will appear alongside the static catalogue."}
        </p>
      </div>

      {saveSuccess && !isEditing && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-inter">
          Flower saved successfully!
        </div>
      )}
      {saveError && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive font-inter">
          {saveError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="af-title" className="font-inter text-sm mb-1.5 block">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="af-title"
                required
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. White Athena"
                className="font-inter"
              />
            </div>

            <div>
              <Label htmlFor="af-category" className="font-inter text-sm mb-1.5 block">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  handleChange("category", v as Exclude<FlowerCategory, "All">)
                }
              >
                <SelectTrigger id="af-category" className="font-inter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c} className="font-inter">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="af-stemPrice" className="font-inter text-sm mb-1.5 block">
                  Stem Price
                </Label>
                <Input
                  id="af-stemPrice"
                  value={form.stemPrice}
                  onChange={(e) => handleChange("stemPrice", e.target.value)}
                  placeholder="$5.50"
                  className="font-inter"
                />
              </div>
              <div>
                <Label htmlFor="af-bunchPrice" className="font-inter text-sm mb-1.5 block">
                  Bunch Price
                </Label>
                <Input
                  id="af-bunchPrice"
                  value={form.bunchPrice}
                  onChange={(e) => handleChange("bunchPrice", e.target.value)}
                  placeholder="$48.99"
                  className="font-inter"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="af-stemPriceValue" className="font-inter text-sm mb-1.5 block">
                  Stem Price (numeric)
                </Label>
                <Input
                  id="af-stemPriceValue"
                  type="number"
                  step="0.01"
                  value={form.stemPriceValue}
                  onChange={(e) => handleChange("stemPriceValue", e.target.value)}
                  placeholder="5.50"
                  className="font-inter"
                />
              </div>
              <div>
                <Label htmlFor="af-bunchPriceValue" className="font-inter text-sm mb-1.5 block">
                  Bunch Price (numeric)
                </Label>
                <Input
                  id="af-bunchPriceValue"
                  type="number"
                  step="0.01"
                  value={form.bunchPriceValue}
                  onChange={(e) => handleChange("bunchPriceValue", e.target.value)}
                  placeholder="48.99"
                  className="font-inter"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="af-badge" className="font-inter text-sm mb-1.5 block">
                Badge
              </Label>
              <Select
                value={form.badge || "none"}
                onValueChange={(v) => handleChange("badge", v === "none" ? "" : v)}
              >
                <SelectTrigger id="af-badge" className="font-inter">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="font-inter">
                    None
                  </SelectItem>
                  {BADGE_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b} className="font-inter">
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-base">Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="af-description" className="font-inter text-sm mb-1.5 block">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="af-description"
                required
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the flower's appearance, scent, and uses…"
                rows={4}
                className="font-inter text-sm"
              />
            </div>
            <div>
              <Label htmlFor="af-symbolism" className="font-inter text-sm mb-1.5 block">
                Symbolism
              </Label>
              <Textarea
                id="af-symbolism"
                value={form.symbolism}
                onChange={(e) => handleChange("symbolism", e.target.value)}
                placeholder="What does this flower symbolise?"
                rows={2}
                className="font-inter text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-base">Images</CardTitle>
            <p className="text-xs text-muted-foreground font-inter mt-1">
              Enter a local path (e.g. <code className="bg-muted px-1 rounded">/images/david/fiorella.jpeg</code>),
              a full URL, or upload a file. All views are optional.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {(["front", "left", "right", "back"] as ImageView[]).map((view) => (
              <ImageSlot
                key={view}
                id={`af-img-${view}`}
                label={`${view.charAt(0).toUpperCase() + view.slice(1)} View`}
                mode={slots[view].mode}
                url={slots[view].url}
                file={slots[view].file}
                uploading={uploadingSlot === view}
                onModeChange={(m) => patchSlot(view, { mode: m })}
                onUrlChange={(u) => patchSlot(view, { url: u })}
                onFileChange={(f) => patchSlot(view, { file: f })}
              />
            ))}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-base">Tags & Attributes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="af-colors" className="font-inter text-sm mb-1.5 block">
                Colours
              </Label>
              <TagInput
                id="af-colors"
                tags={form.colors}
                onChange={(tags) => setForm((p) => ({ ...p, colors: tags }))}
                placeholder="Type a colour and press Enter…"
              />
            </div>
            <div>
              <Label className="font-inter text-sm mb-2 block">Seasons</Label>
              <div className="flex flex-wrap gap-2">
                {SEASON_OPTIONS.map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer font-inter text-sm">
                    <Checkbox
                      checked={form.seasons.includes(s)}
                      onCheckedChange={(checked) => {
                        setForm((prev) => ({
                          ...prev,
                          seasons: checked
                            ? [...prev.seasons, s]
                            : prev.seasons.filter((x) => x !== s),
                        }));
                      }}
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flags */}
        <Card className="border border-border">
          <CardHeader className="pb-3">
            <CardTitle className="font-playfair text-base">Display Flags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { id: "af-featured", field: "featured" as const, label: "Featured", description: "Show in featured section" },
              { id: "af-isnew", field: "isNew" as const, label: "New Arrival", description: "Show in new arrivals" },
              { id: "af-trending", field: "isTrending" as const, label: "Trending", description: "Show in trending section" },
            ].map(({ id, field, label, description }) => (
              <div key={id} className="flex items-start gap-3">
                <Checkbox
                  id={id}
                  checked={form[field]}
                  onCheckedChange={(checked) => handleChange(field, !!checked)}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor={id} className="font-inter text-sm cursor-pointer">
                    {label}
                  </Label>
                  <p className="text-xs text-muted-foreground font-inter">{description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={saving || uploadingSlot !== null}
            className="font-inter tracking-[0.05em] uppercase text-xs"
          >
            {saving
              ? isEditing
                ? "Saving…"
                : "Adding…"
              : isEditing
              ? "Save Changes"
              : "Add Flower"}
          </Button>
          {isEditing && onEditDone && (
            <Button
              type="button"
              variant="outline"
              onClick={onEditDone}
              className="font-inter text-xs"
            >
              Cancel
            </Button>
          )}
          {!isEditing && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              className="font-inter text-xs text-muted-foreground"
            >
              Reset
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

// ── Testimonials section ──────────────────────────────────────────────────────
function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);

  const emptyForm = () => ({ name: "", title: "", quote: "", order: testimonials.length });
  const [form, setForm] = useState(emptyForm);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      setTestimonials(await getTestimonials());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function startEdit(t: Testimonial) {
    setEditItem(t);
    setForm({ name: t.name, title: t.title, quote: t.quote, order: t.order });
    setError(null); setSuccess(false);
  }

  function cancelEdit() { setEditItem(null); setForm(emptyForm()); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null); setSuccess(false);
    try {
      const data = { name: form.name.trim(), title: form.title.trim(), quote: form.quote.trim(), order: Number(form.order) };
      if (editItem) { await updateTestimonial(editItem.id, data); } else { await addTestimonial(data); }
      setSuccess(true);
      cancelEdit();
      await fetchAll();
    } catch (e) { setError((e as Error).message); } finally { setSaving(false); }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete testimonial by "${name}"?`)) return;
    try { await deleteTestimonial(id); await fetchAll(); } catch (e) { alert((e as Error).message); }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">Testimonials</h2>
        <p className="text-sm text-muted-foreground font-inter">
          Manage customer testimonials displayed on the homepage. DB values override static defaults.
        </p>
      </div>

      {success && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-inter">Saved successfully!</div>}
      {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive font-inter">{error}</div>}

      {/* Form */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-playfair text-base">{editItem ? "Edit Testimonial" : "Add Testimonial"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-inter text-sm mb-1.5 block">Customer Name <span className="text-destructive">*</span></Label>
                <Input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} placeholder="Amara K." className="font-inter" />
              </div>
              <div>
                <Label className="font-inter text-sm mb-1.5 block">Role / Title <span className="text-destructive">*</span></Label>
                <Input required value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Wedding Planner" className="font-inter" />
              </div>
            </div>
            <div>
              <Label className="font-inter text-sm mb-1.5 block">Quote <span className="text-destructive">*</span></Label>
              <Textarea required value={form.quote} onChange={e => setForm(p => ({...p, quote: e.target.value}))} rows={3} placeholder="Their flowers made our venue breathtaking…" className="font-inter text-sm" />
            </div>
            <div>
              <Label className="font-inter text-sm mb-1.5 block">Display Order</Label>
              <Input type="number" value={form.order} onChange={e => setForm(p => ({...p, order: Number(e.target.value)}))} className="font-inter w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving} className="font-inter tracking-[0.05em] uppercase text-xs">
                {saving ? "Saving…" : editItem ? "Save Changes" : "Add Testimonial"}
              </Button>
              {editItem && <Button type="button" variant="outline" onClick={cancelEdit} className="font-inter text-xs">Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="border border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="font-playfair text-base">Saved Testimonials ({loading ? "…" : testimonials.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchAll} className="font-inter text-xs">Refresh</Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading && <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}
          {!loading && testimonials.length === 0 && <p className="p-6 text-sm text-muted-foreground font-inter text-center">No testimonials saved yet. Add one above.</p>}
          {!loading && testimonials.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-inter">Name</TableHead>
                  <TableHead className="hidden sm:table-cell font-inter">Title</TableHead>
                  <TableHead className="hidden md:table-cell font-inter">Order</TableHead>
                  <TableHead className="text-right font-inter">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <p className="font-inter text-sm font-medium">{t.name}</p>
                      <p className="font-inter text-xs text-muted-foreground mt-0.5 line-clamp-1 italic">&ldquo;{t.quote}&rdquo;</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-inter text-sm text-muted-foreground">{t.title}</TableCell>
                    <TableCell className="hidden md:table-cell font-inter text-sm">{t.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(t)} title="Edit" className="text-muted-foreground hover:text-foreground transition-colors"><Icon path={ICONS.edit} className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(t.id, t.name)} title="Delete" className="text-muted-foreground hover:text-destructive transition-colors"><Icon path={ICONS.trash} className="w-4 h-4" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Hero Slides section ───────────────────────────────────────────────────────
const EMPTY_BG_SLOT: ImageSlotState = { mode: "url", url: "", file: null };

function HeroSlidesSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [bgUploading, setBgUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [editItem, setEditItem] = useState<HeroSlide | null>(null);

  const [bgSlot, setBgSlot] = useState<ImageSlotState>({ ...EMPTY_BG_SLOT });

  const emptyForm = () => ({ tag: "", title: "", subtitle: "", cta: "collections.html", order: slides.length });
  const [form, setForm] = useState(emptyForm);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      setSlides(await getHeroSlides());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function startEdit(s: HeroSlide) {
    setEditItem(s);
    setBgSlot({ mode: "url", url: s.bg, file: null });
    setForm({ tag: s.tag, title: s.title, subtitle: s.subtitle, cta: s.cta, order: s.order });
    setError(null); setSuccess(false);
  }

  function cancelEdit() {
    setEditItem(null);
    setBgSlot({ ...EMPTY_BG_SLOT });
    setForm(emptyForm());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null); setSuccess(false);
    try {
      let bgUrl = "";
      if (bgSlot.mode === "url") {
        bgUrl = bgSlot.url.trim();
      } else if (bgSlot.file) {
        setBgUploading(true);
        try {
          bgUrl = await uploadHeroSlideImage(bgSlot.file);
        } finally {
          setBgUploading(false);
        }
      }
      if (!bgUrl) {
        setError("Background image is required.");
        setSaving(false);
        return;
      }
      const data = { bg: bgUrl, tag: form.tag.trim(), title: form.title.trim(), subtitle: form.subtitle.trim(), cta: form.cta.trim(), order: Number(form.order) };
      if (editItem) { await updateHeroSlide(editItem.id, data); } else { await addHeroSlide(data); }
      setSuccess(true);
      cancelEdit();
      await fetchAll();
    } catch (e) { setError((e as Error).message); } finally { setSaving(false); }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete slide "${title}"?`)) return;
    try { await deleteHeroSlide(id); await fetchAll(); } catch (e) { alert((e as Error).message); }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">Hero Slides</h2>
        <p className="text-sm text-muted-foreground font-inter">
          Manage homepage carousel slides. DB values override static defaults on the storefront.
        </p>
      </div>

      {success && <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-inter">Saved successfully!</div>}
      {error && <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive font-inter">{error}</div>}

      {/* Form */}
      <Card className="border border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-playfair text-base">{editItem ? "Edit Slide" : "Add Slide"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageSlot
              id="hs-bg"
              label="Background Image"
              required
              mode={bgSlot.mode}
              url={bgSlot.url}
              file={bgSlot.file}
              uploading={bgUploading}
              onModeChange={(m) => setBgSlot((prev) => ({ ...prev, mode: m, file: null }))}
              onUrlChange={(u) => setBgSlot((prev) => ({ ...prev, url: u }))}
              onFileChange={(f) => setBgSlot((prev) => ({ ...prev, file: f }))}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-inter text-sm mb-1.5 block">Tag Label <span className="text-destructive">*</span></Label>
                <Input required value={form.tag} onChange={e => setForm(p => ({...p, tag: e.target.value}))} placeholder="Fresh Arrivals" className="font-inter" />
              </div>
              <div>
                <Label className="font-inter text-sm mb-1.5 block">CTA URL <span className="text-destructive">*</span></Label>
                <Input required value={form.cta} onChange={e => setForm(p => ({...p, cta: e.target.value}))} placeholder="collections.html" className="font-inter" />
              </div>
            </div>
            <div>
              <Label className="font-inter text-sm mb-1.5 block">Slide Title <span className="text-destructive">*</span></Label>
              <Input required value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Nature's Finest Blooms" className="font-inter" />
            </div>
            <div>
              <Label className="font-inter text-sm mb-1.5 block">Subtitle</Label>
              <Input value={form.subtitle} onChange={e => setForm(p => ({...p, subtitle: e.target.value}))} placeholder="Fresh seasonal flowers delivered to your door" className="font-inter" />
            </div>
            <div>
              <Label className="font-inter text-sm mb-1.5 block">Display Order</Label>
              <Input type="number" value={form.order} onChange={e => setForm(p => ({...p, order: Number(e.target.value)}))} className="font-inter w-24" />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={saving || bgUploading} className="font-inter tracking-[0.05em] uppercase text-xs">
                {bgUploading ? "Uploading image…" : saving ? "Saving…" : editItem ? "Save Changes" : "Add Slide"}
              </Button>
              {editItem && <Button type="button" variant="outline" onClick={cancelEdit} className="font-inter text-xs">Cancel</Button>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      <Card className="border border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="font-playfair text-base">Saved Slides ({loading ? "…" : slides.length})</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchAll} className="font-inter text-xs">Refresh</Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading && <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}
          {!loading && slides.length === 0 && <p className="p-6 text-sm text-muted-foreground font-inter text-center">No slides saved yet. Add one above to override the static hero.</p>}
          {!loading && slides.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 font-inter">Img</TableHead>
                  <TableHead className="font-inter">Title</TableHead>
                  <TableHead className="hidden sm:table-cell font-inter">Tag</TableHead>
                  <TableHead className="hidden md:table-cell font-inter">Order</TableHead>
                  <TableHead className="text-right font-inter">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <img src={s.bg} alt={s.title} className="w-10 h-10 object-cover rounded-md bg-muted" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    </TableCell>
                    <TableCell>
                      <p className="font-inter text-sm font-medium">{s.title}</p>
                      <p className="font-inter text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.subtitle}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell font-inter text-xs text-muted-foreground">{s.tag}</TableCell>
                    <TableCell className="hidden md:table-cell font-inter text-sm">{s.order}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(s)} title="Edit" className="text-muted-foreground hover:text-foreground transition-colors"><Icon path={ICONS.edit} className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(s.id, s.title)} title="Delete" className="text-muted-foreground hover:text-destructive transition-colors"><Icon path={ICONS.trash} className="w-4 h-4" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Brand Config section ──────────────────────────────────────────────────────
function BrandConfigSection() {
  const [config, setConfig] = useState<BrandConfig>(DEFAULT_BRAND_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getBrandConfig().then((data) => {
      if (data) setConfig(data);
      setLoading(false);
    });
  }, []);

  function handleChange(field: keyof BrandConfig, value: string) {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await saveBrandConfig(config);
      setSuccess(true);
    } catch (e) {
      setError((e as Error).message ?? "Failed to save config.");
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    if (
      !window.confirm(
        "Reset brand config to static defaults? The Firestore document will be deleted."
      )
    )
      return;
    try {
      await resetBrandConfig();
      setConfig(DEFAULT_BRAND_CONFIG);
      setSuccess(true);
    } catch (e) {
      setError((e as Error).message ?? "Failed to reset config.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const fields: {
    key: keyof BrandConfig;
    label: string;
    placeholder?: string;
    type?: string;
    rows?: number;
    iconPath?: string;
  }[] = [
    { key: "brandName", label: "Brand Name", placeholder: "Flower Catalogue" },
    { key: "tagline", label: "Tagline", placeholder: "Nature's Finest Blooms" },
    {
      key: "subTagline",
      label: "Sub-tagline",
      placeholder: "Fresh seasonal flowers delivered to your door",
    },
    { key: "whatsappNumber", label: "WhatsApp Number (no + or spaces)", placeholder: "254727175835", iconPath: ICONS.phone },
    { key: "phone", label: "Phone (display)", placeholder: "+254 727 175 835", iconPath: ICONS.phone },
    { key: "email", label: "Email", placeholder: "hello@flower-catalog.com", type: "email", iconPath: ICONS.mail },
    { key: "location", label: "Location", placeholder: "Nairobi, Kenya", rows: 2, iconPath: ICONS.map },
    { key: "heroImage", label: "Hero Image URL", placeholder: "https://...", iconPath: ICONS.link },
    { key: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/...", iconPath: ICONS.link },
    { key: "facebook", label: "Facebook URL", placeholder: "https://facebook.com/...", iconPath: ICONS.link },
    { key: "whatsappGreeting", label: "WhatsApp Greeting", rows: 2 },
    { key: "whatsappClosing", label: "WhatsApp Closing", rows: 2 },
  ];

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-playfair text-3xl font-semibold mb-1">Brand Config</h2>
        <p className="text-sm text-muted-foreground font-inter">
          Edit and save your brand settings to Firestore. These override the static defaults in{" "}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">config/brand.ts</code>.
        </p>
      </div>

      {success && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-inter">
          Brand config saved successfully!
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive font-inter">
          {error}
        </div>
      )}

      <Card className="border border-border">
        <CardContent className="pt-6 space-y-5">
          {fields.map(({ key, label, placeholder, type, rows, iconPath }) => (
            <div key={key}>
              <Label htmlFor={`bc-${key}`} className="font-inter text-sm mb-1.5 flex items-center gap-1.5">
                {iconPath && <Icon path={iconPath} className="w-3.5 h-3.5 text-muted-foreground" />}
                {label}
              </Label>
              {rows ? (
                <Textarea
                  id={`bc-${key}`}
                  value={config[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  rows={rows}
                  className="font-inter text-sm"
                />
              ) : (
                <Input
                  id={`bc-${key}`}
                  type={type ?? "text"}
                  value={config[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  placeholder={placeholder}
                  className="font-inter text-sm"
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={saving}
          className="font-inter tracking-[0.05em] uppercase text-xs"
        >
          {saving ? "Saving…" : "Save Config"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="font-inter text-xs text-muted-foreground"
        >
          Reset to Defaults
        </Button>
      </div>
    </form>
  );
}

// ── Main Admin component ──────────────────────────────────────────────────────
export default function Admin() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [editFlower, setEditFlower] = useState<FlowerProduct | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleEdit(f: FlowerProduct) {
    setEditFlower(f);
    setActiveSection("add-flower");
    setSidebarOpen(false);
  }

  function handleEditDone() {
    setEditFlower(null);
    setActiveSection("flowers");
  }

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch {
      // ignore
    }
  }

  function navTo(section: Section) {
    if (section !== "add-flower") setEditFlower(null);
    setActiveSection(section);
    setSidebarOpen(false);
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 flex flex-col bg-background border-r border-border transition-transform duration-200 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-border">
          <p className="font-playfair text-lg font-semibold text-foreground">
            {brand.brandName}
          </p>
          <p className="text-xs font-inter text-muted-foreground mt-0.5 tracking-[0.15em] uppercase">
            Admin
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ id, label, iconPath }) => (
            <button
              key={id}
              onClick={() => navTo(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-inter transition-colors ${
                activeSection === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon path={iconPath} className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-3 py-4 border-t border-border">
          <div className="px-3 py-2 mb-1">
            <p className="font-inter text-xs text-muted-foreground truncate">
              {currentUser?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-inter text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Icon path={ICONS.logout} className="w-4 h-4 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 h-16 border-b border-border bg-background flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground p-1"
            aria-label="Open sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="font-inter text-sm text-muted-foreground">
              {NAV_ITEMS.find((n) => n.id === activeSection)?.label}
            </span>
          </div>
          <a
            href="/"
            className="font-inter text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wide"
            target="_blank"
            rel="noopener noreferrer"
          >
            View site ↗
          </a>
        </header>

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "flowers" && (
            <FlowersSection onEdit={handleEdit} />
          )}
          {activeSection === "add-flower" && (
            <AddFlowerSection
              editFlower={editFlower}
              onEditDone={editFlower ? handleEditDone : undefined}
            />
          )}
          {activeSection === "testimonials" && <TestimonialsSection />}
          {activeSection === "hero-slides" && <HeroSlidesSection />}
          {activeSection === "config" && <BrandConfigSection />}
        </main>
      </div>
    </div>
  );
}
