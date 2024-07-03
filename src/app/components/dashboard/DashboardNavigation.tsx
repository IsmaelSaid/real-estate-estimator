export function DashboardNavigation({onTabChange, activeTab}: {
    onTabChange: (tab: string) => void,
    activeTab: string
}) {
    return <aside id="logo-sidebar"
                  className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 "
                  aria-label="Sidebar">
        <div className=" flex flex-col h-full px-3 pb-4 overflow-y-auto bg-white ">

            <button disabled={activeTab === 'raw_data'}
                className={`border-l-4 border-transparent flex items-center p-2 text-gray-900 hover:bg-gray-100 group  ${activeTab === 'raw_data' && 'bg-gray-100 border-blue-600'}`}
                onClick={() => onTabChange('raw_data')}>
                <span className="ms-3">Raw data </span>
            </button>

            <button
                className={`border-l-4 border-transparent flex items-center p-2 text-gray-900 hover:bg-gray-100  group  ${activeTab === 'charts' && 'bg-gray-100 border-blue-600'}`}
                onClick={() => onTabChange('charts')}>
                <span className="ms-3 ">Charts  </span>
            </button>

        </div>
    </aside>
}