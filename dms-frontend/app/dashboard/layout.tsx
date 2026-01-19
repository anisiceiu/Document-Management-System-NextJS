'use client'
import { FaFolder, FaTrash, FaHome, FaClock, FaFolderOpen } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';
import Link from 'next/link';
import { useState } from 'react';
import { LayoutProvider, useLayout } from '../../providers/LayoutProvider';
import BootBreadcrumbs from '../../components/files/breadcumb';
import FileGrid from '../../components/files/FileGrid';
import {logout} from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
const router = useRouter();
 const onLogoutClick=()=>{
    logout();
     router.replace('/auth/login');
 }

  return (
    <div>

      <nav className="navbar navbar-light bg-white border-bottom px-3">
        <span className="navbar-brand fw-bold">📁 My DMS</span>

        <div className="d-flex align-items-center gap-2">
          <button onClick={onLogoutClick} className="btn btn-danger">
            <i className="bi bi-upload"></i> logout
          </button>
        </div>
      </nav>
      <div className="container-fluid">
        <div className="row vh-100">
          {/* Sidebar */}
          <div className="col-2 bg-light p-3">
            <ul className="list-unstyled sidebar">
              <li className="mb-2"><Link href="/dashboard/home"><FaHome />Home</Link></li>
              <li className="mb-2"><a><FaFolder /> Documents</a></li>
              <li className="mb-2"><a><FaFolderOpen /> Shared</a></li>
              <li className="mb-2"><a><FaClock /> Recent</a></li>
              <li className="mb-2"><a><FaTrash /> Trash</a></li>
            </ul>
          </div>

          {/* Main */}
          <LayoutProvider>
            <div className="col-10 p-4">
              <BootBreadcrumbs />
              {children}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>My Drive</h3>
                <input type="text" className="form-control w-50" placeholder="Search files..." />
              </div>
              <FileGrid />
            </div>
          </LayoutProvider>
        </div>
      </div>
    </div>


  )
}
