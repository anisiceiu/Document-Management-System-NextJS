'use client'
import { FaFolder, FaTrash, FaHome, FaClock, FaFolderOpen } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from 'next/link';
import { useState } from 'react';
import { LayoutProvider, useLayout } from './../providers/LayoutProvider';
import BootBreadcrumbs from '../components/files/breadcumb';
import FileGrid from '../components/files/FileGrid';


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {



  return (
    <html>
      <body>
        <div className="container-fluid">
          <div className="row vh-100">
                {children}
          </div>
        </div>
      </body>
    </html>

  )
}
