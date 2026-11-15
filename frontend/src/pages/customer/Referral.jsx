import { useEffect, useState } from "react";
import {
  Copy,
  Gift,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  applyReferralCode,
  getReferralInfo,
} from "../../services/referralService";

const Referral = () => {
  const [referralCode, setReferralCode] =
    useState("");

  const [referrals, setReferrals] =
    useState([]);

  const [inputCode, setInputCode] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [applying, setApplying] =
    useState(false);

  const fetchReferralInfo = async () => {
    try {
      setLoading(true);

      const response =
        await getReferralInfo();

      if (response.success) {
        setReferralCode(
          response.referralCode || ""
        );

        setReferrals(
          response.referrals || []
        );
      }
    } catch (error) {
      console.error(
        "Referral error:",
        error
      );

      toast.error(
        "Unable to load referral information"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const copyReferralCode = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(
        referralCode
      );

      toast.success(
        "Referral code copied"
      );
    } catch {
      toast.error(
        "Unable to copy referral code"
      );
    }
  };

  const handleApplyCode = async (event) => {
    event.preventDefault();

    if (!inputCode.trim()) {
      toast.error(
        "Please enter referral code"
      );
      return;
    }

    try {
      setApplying(true);

      const response =
        await applyReferralCode(
          inputCode.trim()
        );

      if (response.success) {
        toast.success(
          "Referral code applied successfully"
        );

        setInputCode("");

        await fetchReferralInfo();
      } else {
        toast.error(
          response.message ||
            "Unable to apply referral code"
        );
      }
    } catch (error) {
      console.error(
        "Apply referral error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Invalid referral code"
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="simple-page">
        <h2>Loading referral information...</h2>
      </div>
    );
  }

  return (
    <div className="referral-page">

      <div className="referral-header">

        <div className="referral-icon">
          <Gift size={26} />
        </div>

        <div>
          <h1>Referral Program</h1>
          <p>
            Share your referral code with
            friends and family
          </p>
        </div>

      </div>

      {/* Own Referral Code */}

      <div className="referral-code-card">

        <div className="referral-card-icon">
          <Gift size={25} />
        </div>

        <div className="referral-code-content">

          <h2>Your Referral Code</h2>

          <p>
            Share this code with someone
            who wants to join.
          </p>

          <div className="referral-code-box">

            <strong>
              {referralCode || "Generating..."}
            </strong>

            <button
              type="button"
              onClick={copyReferralCode}
              disabled={!referralCode}
              title="Copy referral code"
            >
              <Copy size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* Apply Referral */}

      <div className="referral-apply-card">

        <h2>Have a Referral Code?</h2>

        <p>
          Enter another user's referral code.
        </p>

        <form
          onSubmit={handleApplyCode}
          className="referral-form"
        >
          <input
            type="text"
            value={inputCode}
            onChange={(event) =>
              setInputCode(
                event.target.value
              )
            }
            placeholder="Enter referral code"
          />

          <button
            type="submit"
            disabled={applying}
          >
            {applying
              ? "Applying..."
              : "Apply Code"}
          </button>
        </form>

      </div>

      {/* Referral History */}

      <div className="referral-history">

        <div className="referral-history-header">
          <div>
            <h2>Your Referrals</h2>
            <p>
              People who joined using your code
            </p>
          </div>

          <div className="referral-count">
            <Users size={18} />
            {referrals.length}
          </div>
        </div>

        {referrals.length === 0 ? (
          <div className="referral-empty">
            <Users size={40} />

            <h3>
              No referrals yet
            </h3>

            <p>
              Share your referral code to
              invite others.
            </p>
          </div>
        ) : (
          <div className="referral-list">

            {referrals.map((referral) => (
              <div
                key={referral._id}
                className="referral-item"
              >

                <div className="referral-user-icon">
                  {referral.referredUser?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <div>
                  <strong>
                    {referral.referredUser
                      ?.name || "User"}
                  </strong>

                  <p>
                    {referral.referredUser
                      ?.email || ""}
                  </p>
                </div>

                <span
                  className={`referral-status ${
                    referral.status
                  }`}
                >
                  {referral.status}
                </span>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Referral;