import type { Metadata } from "next";
import Image from "next/image";
import {
  Archive,
  Camera,
  Copy,
  Heart,
  Home,
  PackageCheck,
  RotateCcw,
  Ruler,
  Sparkles,
  Trash2,
  UserRound,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AddressForm } from "@/components/forms/address-form";
import { MeasurementForm } from "@/components/forms/measurement-form";
import { ProfileForm } from "@/components/forms/profile-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NoOrders, NoResults, NoWishlist } from "@/components/ui/empty-state";
import { siteConfig } from "@/lib/config/site";
import {
  archiveMeasurementAction,
  deleteAddressAction,
  deleteMeasurementAction,
  duplicateMeasurementAction,
  restoreMeasurementAction,
  setDefaultAddressAction,
} from "@/features/profile/actions";
import { getProfileDashboardData } from "@/features/profile/data";
import { deleteProfileImageAction, uploadProfileImageAction } from "@/features/media/actions";
import { getFitProfileData } from "@/features/fit/data";
import { FitProfileForm } from "@/components/fit/fit-profile-form";
import {
  addressValues,
  historyValues,
  measurementValues,
  profileValues,
} from "@/features/profile/view-models";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your FIT & MATCH profile, addresses, and saved measurements.",
};

export default async function ProfilePage() {
  const [user, fitData] = await Promise.all([getProfileDashboardData(), getFitProfileData()]);
  const profile = profileValues(user);
  const activeMeasurements = user.measurements.filter((item) => !item.archivedAt);
  const archivedMeasurements = user.measurements.filter((item) => item.archivedAt);
  const defaultFitProfile = fitData.profile.fitProfiles[0];

  return (
    <main className="py-10 md:py-14">
      <div className={`${siteConfig.maxWidthClass} grid gap-8`}>
        <Card className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-full bg-[#fde8f3] text-[#c21874]">
            {user.avatar ? (
              <Image alt={user.name} className="object-cover" fill sizes="96px" src={user.avatar} />
            ) : (
              <UserRound className="h-10 w-10" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#c21874]">My Account</p>
            <h1 className="mt-2 text-3xl font-semibold text-[#241820]">{user.name}</h1>
            <p className="mt-2 text-sm leading-6 text-[#756871]">
              {user.email} - {user.emailVerified ? "Verified email" : "Email verification pending"}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4 text-center shadow-sm">
            <p className="text-3xl font-semibold text-[#c21874]">{profile.completion}%</p>
            <p className="text-xs font-semibold text-[#756871]">Profile complete</p>
          </div>
          <div className="grid gap-2 md:col-span-3">
            <form action={uploadProfileImageAction} className="flex flex-col gap-2 sm:flex-row sm:items-center" encType="multipart/form-data">
              <input className="rounded-2xl border border-[#eadde6] p-3 text-sm" name="file" type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
              <Button type="submit" variant="secondary">Upload Profile Photo</Button>
            </form>
            {user.avatar ? (
              <form action={deleteProfileImageAction}>
                <Button type="submit" variant="ghost">Delete Profile Photo</Button>
              </form>
            ) : null}
          </div>
        </Card>

        <section aria-label="Profile dashboard" className="grid gap-4 md:grid-cols-3">
          <DashboardCard title="My Profile" text="Personal details and preferences" icon={UserRound} />
          <DashboardCard title="My Measurements" text={`${activeMeasurements.length} active profiles`} icon={Ruler} />
          <DashboardCard title="My Addresses" text={`${user.addresses.length} saved addresses`} icon={Home} />
          <DashboardCard title="Wishlist" text={`${user.wishlist.length} saved styles`} icon={Heart} />
          <DashboardCard title="Orders" text="Commerce placeholder" icon={PackageCheck} />
          <DashboardCard title="Recently Viewed" text={`${user.recentlyViewed.length} recent products`} icon={Sparkles} />
        </section>

        <details className="group rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm" open>
          <summary className="cursor-pointer list-none text-xl font-semibold text-[#241820]">
            My Profile
          </summary>
          <div className="mt-5">
            <ProfileForm values={profile} />
          </div>
        </details>

        <details className="group rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm" open>
          <summary className="cursor-pointer list-none text-xl font-semibold text-[#241820]">
            My Style Preferences
          </summary>
          <div className="mt-5">
            {fitData.measurements.length > 0 ? (
              <FitProfileForm
                measurements={fitData.measurements}
                defaults={defaultFitProfile ? {
                  measurementProfileId: defaultFitProfile.measurementProfileId,
                  name: defaultFitProfile.name,
                  bodyType: defaultFitProfile.bodyType,
                  skinTone: defaultFitProfile.skinTone,
                  preferredFit: defaultFitProfile.preferredFit,
                  colors: defaultFitProfile.colorPreferences.filter((item) => !item.avoid).map((item) => item.colorName).join(", "),
                  avoidedColors: defaultFitProfile.colorPreferences.filter((item) => item.avoid).map((item) => item.colorName).join(", "),
                  fabrics: defaultFitProfile.fabricPreferences.filter((item) => !item.avoid).map((item) => item.fabricName).join(", "),
                  avoidedFabrics: defaultFitProfile.fabricPreferences.filter((item) => item.avoid).map((item) => item.fabricName).join(", "),
                  occasions: defaultFitProfile.occasionPreferences.map((item) => item.occasionName).join(", "),
                } : undefined}
              />
            ) : (
              <p className="text-sm text-[#756871]">Create a measurement profile before setting FIT & MATCH preferences.</p>
            )}
          </div>
        </details>

        <details className="group rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm" open>
          <summary className="cursor-pointer list-none text-xl font-semibold text-[#241820]">
            My Addresses
          </summary>
          <div className="mt-5 grid gap-5">
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-[#241820]">Add address</h2>
              <AddressForm values={addressValues()} />
            </Card>
            <div className="grid gap-4">
              {user.addresses.map((address) => (
                <Card key={address.id}>
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <p className="text-lg font-semibold text-[#241820]">
                        {address.fullName} {address.isDefault ? "(Default)" : ""}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#756871]">
                        {address.house}, {address.street}, {address.city}, {address.state} - {address.pincode}
                      </p>
                      <p className="text-sm text-[#756871]">{address.phone} - {address.type}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {!address.isDefault ? (
                        <form action={setDefaultAddressAction}>
                          <input name="id" type="hidden" value={address.id} />
                          <Button variant="secondary" type="submit">Default</Button>
                        </form>
                      ) : null}
                      <form action={deleteAddressAction}>
                        <input name="id" type="hidden" value={address.id} />
                        <Button aria-label="Delete address" variant="ghost" type="submit">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-[#c21874]">Edit address</summary>
                    <div className="mt-4">
                      <AddressForm values={addressValues(address)} />
                    </div>
                  </details>
                </Card>
              ))}
            </div>
          </div>
        </details>

        <details className="group rounded-3xl border border-[#eadde6] bg-white p-5 shadow-sm" open>
          <summary className="cursor-pointer list-none text-xl font-semibold text-[#241820]">
            My Measurements
          </summary>
          <div className="mt-5 grid gap-5">
            <div className="grid gap-4 md:grid-cols-3">
              <ComingSoon title="AI Measurement" icon={WandSparkles} />
              <ComingSoon title="Camera Measurement" icon={Camera} />
              <ComingSoon title="Virtual Try-On" icon={Sparkles} />
            </div>

            <Card>
              <h2 className="mb-4 text-lg font-semibold text-[#241820]">Create measurement profile</h2>
              <MeasurementForm values={measurementValues()} />
            </Card>

            {activeMeasurements.map((measurement) => {
              const history = historyValues(measurement.history);
              return (
                <Card key={measurement.id}>
                  <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                    <div>
                      <p className="text-lg font-semibold text-[#241820]">
                        {measurement.profileName} {measurement.isDefault ? "(Default)" : ""}
                      </p>
                      <p className="mt-2 text-sm text-[#756871]">
                        Last updated {measurement.updatedAt.toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <ProfileAction action={duplicateMeasurementAction} id={measurement.id} label="Duplicate" icon={Copy} />
                      <ProfileAction action={archiveMeasurementAction} id={measurement.id} label="Archive" icon={Archive} />
                      <ProfileAction action={deleteMeasurementAction} id={measurement.id} label="Delete" icon={Trash2} />
                    </div>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-[#c21874]">Edit measurements</summary>
                    <div className="mt-4">
                      <MeasurementForm values={measurementValues(measurement)} />
                    </div>
                  </details>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-[#c21874]">Measurement history</summary>
                    <div className="mt-4 grid gap-3">
                      {history.length > 0 ? history.map((item) => (
                        <div className="rounded-2xl bg-[#fffafd] p-4" key={item.id}>
                          <p className="text-sm font-semibold text-[#241820]">{item.createdAt}</p>
                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            <pre className="overflow-auto rounded-2xl bg-white p-3 text-xs text-[#756871]">{item.previousValues}</pre>
                            <pre className="overflow-auto rounded-2xl bg-white p-3 text-xs text-[#756871]">{item.updatedValues}</pre>
                          </div>
                        </div>
                      )) : <p className="text-sm text-[#756871]">No edits recorded yet.</p>}
                    </div>
                  </details>
                </Card>
              );
            })}

            {archivedMeasurements.length > 0 ? (
              <details className="rounded-3xl bg-[#fffafd] p-5">
                <summary className="cursor-pointer text-sm font-semibold text-[#c21874]">Archived profiles</summary>
                <div className="mt-4 grid gap-3">
                  {archivedMeasurements.map((measurement) => (
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4" key={measurement.id}>
                      <span className="font-semibold text-[#241820]">{measurement.profileName}</span>
                      <ProfileAction action={restoreMeasurementAction} id={measurement.id} label="Restore" icon={RotateCcw} />
                    </div>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        </details>

        <section className="grid gap-4 md:grid-cols-3" aria-label="Placeholders">
          <NoWishlist />
          <NoOrders />
          <NoResults />
        </section>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  text,
  icon: Icon,
}: {
  title: string;
  text: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <Icon className="mb-4 h-6 w-6 text-[#c21874]" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-[#241820]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#756871]">{text}</p>
    </Card>
  );
}

function ComingSoon({ title, icon: Icon }: { title: string; icon: LucideIcon }) {
  return (
    <Card className="bg-[#fffafd]">
      <Icon className="mb-4 h-6 w-6 text-[#c21874]" aria-hidden="true" />
      <h2 className="text-lg font-semibold text-[#241820]">{title}</h2>
      <p className="mt-2 text-sm font-semibold text-[#756871]">Coming Soon</p>
    </Card>
  );
}

function ProfileAction({
  action,
  id,
  label,
  icon: Icon,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <form action={action}>
      <input name="id" type="hidden" value={id} />
      <Button aria-label={label} variant="secondary" type="submit">
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </form>
  );
}
