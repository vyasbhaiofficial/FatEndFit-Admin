"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/components/RoleGuard";
import { Header, Button } from "@/utils/header";
import Loader from "@/utils/loader";
import { API_BASE, getUserOverview } from "@/Api/AllApi";

const UserProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id;

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // for popup
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getUserOverview(userId);
        setOverview(data || null);
      } catch {
        setOverview(null);
      } finally {
        setLoading(false);
      }
    };
    if (userId) load();
  }, [userId]);

  // handle popup close with fade-out
  const closePopup = () => {
    setClosing(true);
    setTimeout(() => {
      setSelectedDay(null);
      setClosing(false);
    }, 200);
  };

  // day select ke time answers bhi attach karo
  const handleDayClick = (dayObj) => {
    const report =
      overview?.dailyReports?.find((r) => r.day === dayObj.day) || {};
    setSelectedDay({ ...dayObj, answers: report.answers || [] });
  };

  return (
    <RoleGuard allow={["Admin", "subadmin"]}>
      <div className="py-6 px-6 md:px-12">
        <div className="flex items-center justify-between mb-6 px-8">
          <Header size="3xl">User Profile</Header>
          <Button onClick={() => router.back()}>Back</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader />
          </div>
        ) : !overview ? (
          <div className="text-gray-600">No user found.</div>
        ) : (
          <div className="space-y-8">
            <div className="p-8 mx-8 bg-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-6">
              {/* User Image */}
              <div className="w-25 h-25 rounded-full overflow-hidden bg-amber-100 shadow">
                {overview.user?.image ? (
                  <img
                    src={`${API_BASE}/${overview.user.image}`}
                    alt={overview.user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl font-bold text-yellow-600">
                    {overview.user?.name?.[0] || "U"}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  {overview.user?.name} {overview.user?.surname}
                </h2>
                <p className="text-md text-gray-600">
                  {overview.user?.gender} • {overview.user?.age} yrs
                </p>
                <p className="text-md text-gray-600">
                  {overview.user?.city}, {overview.user?.state},{" "}
                  {overview.user?.country}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 text-md">
                <div className="p-5 rounded-xl bg-amber-100 shadow-sm">
                  <div className="text-gray-500">Plan</div>
                  <div className="font-semibold text-gray-800">
                    {overview.user?.plan?.name || "-"}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-amber-100 shadow-sm">
                  <div className="text-gray-500">Day</div>
                  <div className="font-semibold text-gray-800">
                    {overview.user?.planCurrentDay ?? 0}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-amber-100 shadow-sm">
                  <div className="text-gray-500">Branch</div>
                  <div className="font-semibold text-gray-800">
                    {overview.user?.branch?.name || "-"}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-amber-100 shadow-sm">
                  <div className="text-gray-500">Mobile</div>
                  <div className="font-semibold text-gray-800">
                    {overview.user?.mobilePrefix} {overview.user?.mobileNumber}
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-amber-100 shadow-sm">
                  <div className="text-gray-500">Height / Weight</div>
                  <div className="font-semibold text-gray-800">
                    {overview.user?.height} cm / {overview.user?.weight} kg
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-amber-100 shadow-sm">
                  <div className="text-gray-500">Language</div>
                  <div className="font-semibold text-gray-800">
                    {overview.user?.language || "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* ------------------ Progress by Day ------------------ */}
            <div className="p-8 mx-7 bg-white rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Progress by Day
                </h3>
                <span className="text-sm text-gray-500">Latest first</span>
              </div>

              {Array.isArray(overview.progress) && overview.progress.length ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
                  {overview.progress.map((d) => (
                    <div
                      key={d.day}
                      className="rounded-2xl bg-white shadow-lg transition overflow-hidden"
                    >
                      {d.firstThumbnail ? (
                        <img
                          src={`${API_BASE}/${d.firstThumbnail}`}
                          alt={`Day ${d.day}`}
                          className="w-full h-50 bg-amber-100 object-cover"
                        />
                      ) : (
                        <div className="w-full h-50 bg-amber-100" />
                      )}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Day</span>
                          <span className="text-sm font-semibold text-gray-800">
                            {d.day}
                          </span>
                        </div>

                        {/* progress bar */}
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: `${d.dayProgressPercent || 0}%` }}
                          />
                        </div>
                        <div className="text-right text-xs text-gray-600">
                          {d.dayProgressPercent || 0}%
                        </div>

                        {/* Button to open popup */}
                        <Button
                          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black rounded py-2 mt-1 mb-3 shadow"
                          onClick={() => handleDayClick(d)}
                        >
                          View Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No progress yet.</div>
              )}
            </div>

            {/* ------------------ Plan History ------------------ */}
            <div className="p-6 mx-8 bg-white rounded-2xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Plan History
                </h3>
                <span className="text-sm text-gray-500">Recent first</span>
              </div>
              {Array.isArray(overview.planHistory) &&
              overview.planHistory.length ? (
                <div className="space-y-4">
                  {overview.planHistory.map((h) => (
                    <div
                      key={h._id}
                      className="flex items-center justify-between rounded-xl bg-amber-100 shadow-md p-4  hover:shadow-lg transition"
                    >
                      <div>
                        <div className="font-semibold text-gray-800 text-base">
                          {h.plan?.name || "Plan"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {h.plan?.days ? `${h.plan.days} days` : ""}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(h.createdAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No plan changes yet.</div>
              )}
            </div>
          </div>
        )}

        {/* ------------------ Popup Modal ------------------ */}
        {selectedDay && (
          <div
            className={`fixed inset-0 flex items-center justify-center z-50 bg-black/50 ${
              closing ? "animate-fade-out" : "animate-fade-in"
            }`}
          >
            <div className="bg-white w-[90%] md:w-[70%] lg:w-[50%] rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                onClick={closePopup}
              >
                ✕
              </button>

              <h2 className="text-xl font-bold mb-4 text-yellow-500">
                Day {selectedDay.day} - Detailed Report
              </h2>

              {selectedDay.answers && selectedDay.answers.length ? (
                <div className="space-y-4">
                  {selectedDay.answers.map((a, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-yellow-50 shadow hover:bg-yellow-100 transition"
                    >
                      <div className="text-gray-700 font-medium">
                        {a.question}
                      </div>
                      <div className="mt-1 text-gray-900 font-semibold">
                        {a.givenAnswer || "-"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No answers for this day.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
};

export default UserProfilePage;
