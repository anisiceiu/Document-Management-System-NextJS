import { FaFolder, FaTrash } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

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
            {/* Sidebar */}
            <div className="col-2 bg-light p-3">
              <h4>My Drive</h4>
              <ul className="list-unstyled">
                <li className="mb-2"><FaFolder /> Home</li>
                <li className="mb-2"><FaFolder /> Documents</li>
                <li className="mb-2"><FaFolder /> Shared</li>
                <li className="mb-2"><FaTrash /> Trash</li>
              </ul>
            </div>

            {/* Main */}
            <div className="col-10 p-4">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>

  )
}
