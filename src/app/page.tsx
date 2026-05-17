"use client";

import { ArrowRight, BadgeCheck, Blocks, Cloud, Download, FileArchive, Gauge, History, LockKeyhole, PackageCheck, ShieldCheck, Smartphone, UploadCloud, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { AppCard } from "@/components/app-card";
import { PublicShell } from "@/components/public-shell";
import type { AppRecord } from "@/lib/types";

export default function Home() {
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apps", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setApps(data.apps ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicShell>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-14">
        <div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-violet-950 sm:text-5xl lg:text-6xl">
            Ship trusted APK builds from one polished portal.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            AppShare gives teams a clean download home for Android apps, internal builds, beta releases, QA packages, and customer-ready APKs.
          </p>
          <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              { value: "APK", label: "validated uploads" },
              { value: "R2", label: "fast file delivery" },
              { value: "Neon", label: "release metadata" }
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-violet-100 bg-white/80 p-4 shadow-sm">
                <p className="text-2xl font-bold text-violet-950">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#apps" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-700">
              Browse Apps
              <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-2xl shadow-violet-950/10">
            <img src="/assets/hero-app-sharing.jpg" alt="People sharing a mobile app on a phone" className="h-[25rem] w-full object-cover sm:h-[31rem]" />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 grid gap-3 rounded-xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-violet-950/10 backdrop-blur sm:left-8 sm:right-8 sm:grid-cols-3">
            {[
              { label: "Signed downloads", icon: ShieldCheck },
              { label: "Fast CDN delivery", icon: Cloud },
              { label: "Version history", icon: Download }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg bg-violet-50 px-3 py-2">
                  <Icon className="size-5 shrink-0 text-violet-600" />
                  <span className="text-sm font-bold text-violet-950">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-12 pt-8 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
          <img src="/assets/dashboard-analytics.jpg" alt="Analytics dashboard" className="h-40 w-full object-cover" />
          <div className="p-4">
            <h2 className="font-bold text-violet-950">Release visibility</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Track published apps and build history from a clean operational view.</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
          <img src="/assets/release-workspace.jpg" alt="Laptop workspace for release management" className="h-40 w-full object-cover" />
          <div className="p-4">
            <h2 className="font-bold text-violet-950">Secure publishing</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Upload APKs through protected serverless routes with strict file validation.</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
          <img src="/assets/mobile-users.jpg" alt="Mobile users sharing an app" className="h-40 w-full object-cover" />
          <div className="p-4">
            <h2 className="font-bold text-violet-950">Simple access</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Give users a fast, responsive download portal for the latest build.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">Distribution Workflow</p>
            <h2 className="mt-2 text-3xl font-bold text-violet-950 sm:text-4xl">Everything a hosted app page needs after the build is ready.</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Keep every APK tied to the app it belongs to, the version users should install, and the release notes that explain what changed.
            </p>
            <div className="mt-6 grid gap-3">
              {[
                { title: "Upload the APK", text: "Validate the package server-side before it lands in Cloudflare R2.", icon: UploadCloud },
                { title: "Publish a version", text: "Attach changelogs, file size, release date, and download URL to each build.", icon: PackageCheck },
                { title: "Share the portal", text: "Users get a responsive app page with the latest release and full history.", icon: Smartphone }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex gap-4 rounded-xl border border-violet-100 bg-white p-4 shadow-sm">
                    <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-700">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-violet-950">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <img src="/assets/phone-testing.jpg" alt="Testing a mobile app on a phone" className="h-72 w-full rounded-xl object-cover shadow-lg shadow-violet-950/10" />
            <img src="/assets/release-review.jpg" alt="Reviewing release materials on a desk" className="h-72 w-full rounded-xl object-cover shadow-lg shadow-violet-950/10 sm:mt-10" />
          </div>
        </div>
      </section>
      <section className="bg-violet-950 py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-300">Platform Features</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Built for teams that publish outside the app store.</h2>
            </div>
            <p className="text-base leading-7 text-violet-100">
              Use it for internal tools, private client apps, field-team releases, QA handoffs, training builds, and beta programs where clarity matters.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "App Catalog", text: "A clean public list for every app you make available.", icon: Blocks },
              { title: "Version History", text: "Older builds stay discoverable with changelogs.", icon: History },
              { title: "Download Confidence", text: "Users see file size, date, and version before installing.", icon: BadgeCheck },
              { title: "Fast Delivery", text: "APK binaries are served from object storage and CDN-ready URLs.", icon: Gauge }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/8 p-5">
                  <Icon className="size-6 text-violet-200" />
                  <h3 className="mt-5 font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-violet-100">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">Use Cases</p>
          <h2 className="mt-2 text-3xl font-bold text-violet-950">Host builds for every audience that needs a direct install.</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Internal Teams", image: "/assets/team-collaboration.jpg", text: "Share operational apps with staff and departments." },
            { title: "Client Delivery", image: "/assets/product-launch.jpg", text: "Give customers a professional page for approved releases." },
            { title: "Beta Testing", image: "/assets/mobile-desk.jpg", text: "Keep testers on the right build with visible version notes." },
            { title: "Field Deployments", image: "/assets/secure-device.jpg", text: "Distribute APKs to devices that need quick direct access." }
          ].map((item) => (
            <article key={item.title} className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
              <img src={item.image} alt="" className="h-44 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-violet-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
            <img src="/assets/app-preview.jpg" alt="Mobile app preview" className="h-80 w-full object-cover" />
            <div className="p-5">
              <h2 className="text-2xl font-bold text-violet-950">A download page that answers the install questions.</h2>
              <p className="mt-2 leading-7 text-slate-600">
                Every app detail page can show current version, release date, changelog, package size, and all previous builds in one place.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              { title: "APK-only validation", text: "Server routes reject non-APK uploads before storage.", icon: FileArchive },
              { title: "Private publishing access", text: "Publishing tools stay hidden from the public navigation and protected behind authentication.", icon: LockKeyhole },
              { title: "User-ready downloads", text: "Download buttons point to R2-backed files for reliable delivery.", icon: UsersRound }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
                  <Icon className="size-6 text-violet-600" />
                  <h3 className="mt-4 font-bold text-violet-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <img src="/assets/phone-builds.jpg" alt="Phone build interface" className="h-60 w-full rounded-xl object-cover shadow-sm" />
        <img src="/assets/mobile-interface.jpg" alt="Mobile interface preview" className="h-60 w-full rounded-xl object-cover shadow-sm" />
        <img src="/assets/mobile-interface-alt.jpg" alt="Alternate mobile interface preview" className="h-60 w-full rounded-xl object-cover shadow-sm" />
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm lg:grid-cols-[0.92fr_1.08fr]">
          <img src="/assets/download-users.jpg" alt="People using a mobile download page" className="h-72 w-full object-cover lg:h-full" />
          <div className="p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">Download Experience</p>
            <h2 className="mt-2 text-3xl font-bold text-violet-950">Make every release feel official before users tap install.</h2>
            <p className="mt-4 leading-7 text-slate-600">
              A hosted app page gives users one reliable place to confirm the app name, read what changed, and install the correct APK without searching through messages or shared folders.
            </p>
          </div>
        </div>
      </section>
      <section id="apps" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">Downloads</p>
            <h2 className="mt-2 text-3xl font-bold text-violet-950">Available Apps</h2>
          </div>
        </div>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-64 animate-pulse rounded-xl bg-white/70" />
            ))}
          </div>
        ) : apps.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-violet-950">No apps published yet</h3>
            <p className="mt-2 text-slate-600">Published apps will appear here with download links and version history.</p>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
