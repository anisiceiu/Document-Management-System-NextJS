import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <nav className="navbar navbar-light bg-white border-bottom px-3">
        <span className="navbar-brand fw-bold">📁 My DMS</span>

        <div className="d-flex align-items-center gap-2">
          <Link href="/auth/login" className="btn btn-primary">
            <i className="bi bi-upload"></i> Login
          </Link>
        </div>
      </nav>
      <div className="container-fluid">
        <div className="row vh-100">
          <div className="container py-5">
            {/* Hero Section */}
            <div className="text-center my-5">
              <h1 className="display-4 fw-bold">Welcome to Our DMS</h1>
              <p className="lead text-muted">
                These are the essentials every small business should expect in a DMS:
              </p>
              <a href="/login" className="btn btn-primary btn-lg mt-3">
                Get Started
              </a>
            </div>

            {/* Features Section */}
            <div className="row text-center my-5">
              <div className="col-md-4 mb-4">
                <div className="p-4 border rounded shadow-sm h-100">
                  <h5>Fast</h5>
                  <p className="text-muted">Experience lightning-fast performance.</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="p-4 border rounded shadow-sm h-100">
                  <h5>Secure</h5>
                  <p className="text-muted">Your data is safe with top security.</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="p-4 border rounded shadow-sm h-100">
                  <h5>Reliable</h5>
                  <p className="text-muted">Built for reliability and uptime.</p>
                </div>
              </div>
            </div>

            {/* Call-to-Action */}
            <div className="text-center my-5">
              <h2 className="fw-bold">Start Your Journey Today</h2>
              <Link href="/auth/login" className="btn btn-outline-primary btn-lg mt-3">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
