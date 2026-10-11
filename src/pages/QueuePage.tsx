import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useApp } from '../state/AppProvider';
import type { Customer, Priority } from '../data/types';
import { Asset, Badge, Button, Card, EmptyState } from '../components/ui';
import PageHeading from '../components/PageHeading';
import styles from './QueuePage.module.css';
export const priorityTone = (p: Priority) =>
  p === 'Urgent' ? 'red' : p === 'High' ? 'amber' : p === 'Medium' ? 'blue' : 'neutral';
export function waitTime(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}m ${String(seconds % 60).padStart(2, '0')}s`;
}
export function CustomerAvatar({
  customer,
  preview = false,
}: {
  customer: Customer;
  preview?: boolean;
}) {
  return (
    <span className={`${styles.avatar} ${preview ? styles.previewAvatar : ''}`}>
      <span className={styles.crop}>
        {customer.avatar ? (
          <img
            className={
              preview && customer.id === 'CUST-4409'
                ? styles.previewPhoto
                : customer.id === 'CUST-1092'
                  ? styles.marcusPhoto
                  : customer.id === 'CUST-5210'
                    ? styles.carlosPhoto
                    : styles.sarahPhoto
            }
            src={preview && customer.id === 'CUST-4409' ? '/assets/preview-0.png' : customer.avatar}
            alt=""
          />
        ) : (
          customer.initials
        )}
      </span>
      {customer.verified && (
        <span className={styles.verified} title="Verified customer">
          <Asset name={preview ? 'preview-1' : 'queue-3'} />
        </span>
      )}
    </span>
  );
}
export default function QueuePage() {
  const { state, dispatch } = useApp();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const [priority, setPriority] = useState('All');
  const [status, setStatus] = useState('All');
  const [channel, setChannel] = useState('All');
  const [sort, setSort] = useState('longest');
  const [refreshed, setRefreshed] = useState(false);
  useEffect(() => {
    if (!refreshed) return;
    const id = setTimeout(() => setRefreshed(false), 2500);
    return () => clearTimeout(id);
  }, [refreshed]);
  const queue = state.interactions.filter((i) => i.status !== 'Ended');
  const longest = queue.reduce((max, i) => Math.max(max, i.waitSeconds), 0);
  const average = queue.length
    ? Math.round(queue.reduce((sum, i) => sum + i.waitSeconds, 0) / queue.length)
    : 0;
  const assigned = state.cases.filter(
    (c) => c.ownerId === state.currentAgentId && c.status !== 'Resolved',
  ).length;
  const selected = queue.find((i) => i.id === state.selectedInteractionId) ?? queue[0];
  const selectedCase = state.cases.find((c) => c.id === selected?.caseId);
  const selectedCustomer = state.customers.find((c) => c.id === selected?.customerId);
  const escalated = state.cases.filter((c) => c.status === 'Escalated').length;
  const entries = queue
    .filter((i) => {
      const customer = state.customers.find((c) => c.id === i.customerId)!;
      const record = state.cases.find((c) => c.id === i.caseId)!;
      const term = query.toLowerCase().trim();
      return (
        `${customer.name} ${customer.phone} ${customer.email} ${customer.id} ${record.id} ${record.title}`
          .toLowerCase()
          .includes(term) &&
        (priority === 'All' || record.priority === priority) &&
        (status === 'All' || record.status === status) &&
        (channel === 'All' ||
          i.channel === channel ||
          (channel === 'VIP' && record.status === 'Escalated'))
      );
    })
    .sort((a, b) =>
      sort === 'longest' ? b.waitSeconds - a.waitSeconds : a.waitSeconds - b.waitSeconds,
    );
  const channelFilters = [
    { key: 'All', label: 'All Channels', count: queue.length },
    {
      key: 'Voice',
      label: 'Voice Calls',
      asset: 'filter-6',
      count: queue.filter((i) => i.channel === 'Voice').length,
    },
    {
      key: 'Chat',
      label: 'Web Chats',
      asset: 'filter-7',
      count: queue.filter((i) => i.channel === 'Chat').length,
    },
    {
      key: 'Email',
      label: 'Emails',
      asset: 'filter-8',
      count: queue.filter((i) => i.channel === 'Email').length,
    },
    { key: 'VIP', label: 'Escalations & VIP', asset: 'filter-9', count: escalated },
  ];
  return (
    <>
      <div className={styles.alert} role="status">
        <span className={styles.alertDot} />
        <strong>Queue SLA Warning</strong>
        <span>
          {queue.filter((i) => i.waitSeconds > 480).length} interaction exceeding the 8-minute
          waiting target
        </span>
        <Badge>Sample routing queue</Badge>
      </div>
      <div className={styles.page}>
        <PageHeading title="Real-Time Omnichannel Queue" breadcrumb="Work Queue">
          <Badge>Demo session</Badge>
          <Button
            variant="secondary"
            disabled
            title="Bulk reassignment is not available in this foundation build"
          >
            <Asset name="heading-0" />
            Bulk Reassign
          </Button>
          <Button onClick={() => setRefreshed(true)}>
            <Asset name="heading-1" />
            Refresh Queue
          </Button>
        </PageHeading>
        <div className={styles.metrics} data-node-id="8:58">
          <Card className={styles.metric}>
            <div>
              <span>
                Total Queue
                <br />
                Items
              </span>
              <Badge>Omnichannel</Badge>
            </div>
            <div>
              <strong>{queue.length}</strong>
              <small>
                <b>{escalated} Escalated</b> ·{' '}
                {state.cases.filter((c) => c.priority === 'High').length} High
              </small>
            </div>
            <div className={styles.track}>
              <i
                style={{
                  width: `${Math.min((queue.length / 8) * 100, 100)}%`,
                  background: '#38bdf8',
                }}
              />
            </div>
          </Card>
          <Card className={styles.metric}>
            <div>
              <span>
                Longest Wait
                <br />
                Time
              </span>
              <Badge tone="red">SLA Breach Risk</Badge>
            </div>
            <div>
              <strong className={styles.red}>{waitTime(longest)}</strong>
              <small>
                {state.customers.find(
                  (c) => c.id === queue.find((i) => i.waitSeconds === longest)?.customerId,
                )?.name ?? 'No waiting work'}
              </small>
            </div>
            <div className={styles.track}>
              <i
                style={{ width: `${Math.min((longest / 600) * 100, 100)}%`, background: '#f43f5e' }}
              />
            </div>
          </Card>
          <Card className={styles.metric}>
            <div>
              <span>
                Average Queue
                <br />
                Wait
              </span>
              <Badge tone="green">Target &lt; 3m</Badge>
            </div>
            <div>
              <strong>{waitTime(average)}</strong>
              <small className={styles.green}>
                <Asset name="metric-0" />
                Sample shift
              </small>
            </div>
            <div className={styles.track}>
              <i
                style={{ width: `${Math.min((average / 600) * 100, 100)}%`, background: '#10b981' }}
              />
            </div>
          </Card>
          <Card className={styles.metric}>
            <div>
              <span>Assigned to Me</span>
              <Badge>
                Tier 2 {state.agents.find((a) => a.id === state.currentAgentId)?.availability}
              </Badge>
            </div>
            <div>
              <strong>{assigned} items</strong>
              <small>Capacity: {assigned}/8</small>
            </div>
            <div className={styles.track}>
              <i
                style={{ width: `${Math.min((assigned / 8) * 100, 100)}%`, background: '#8b5cf6' }}
              />
            </div>
          </Card>
        </div>
        <Card className={styles.filters}>
          <div className={styles.filterRow}>
            <label className={styles.search}>
              <Asset name="filter-0" />
              <input
                aria-label="Search queue"
                placeholder="Search by customer name, phone, email, or case ID..."
                value={query}
                onChange={(e) => {
                  const next = new URLSearchParams(params);
                  if (e.target.value) next.set('q', e.target.value);
                  else next.delete('q');
                  setParams(next, { replace: true });
                }}
              />
              <button
                aria-label="Clear queue search"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.delete('q');
                  setParams(next, { replace: true });
                }}
              >
                <Asset name="filter-1" />
              </button>
            </label>
            <label className={styles.select}>
              <Asset name="filter-2" />
              <select
                aria-label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="All">All Priorities</option>
                {['Urgent', 'High', 'Medium', 'Low'].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <Asset name="filter-3" />
            </label>
            <label className={styles.select}>
              <Asset name="filter-4" />
              <select
                aria-label="Case status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">All Case Statuses</option>
                {['New', 'In Progress', 'Waiting for Customer', 'Escalated', 'Resolved'].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
              <Asset name="filter-3" />
            </label>
            <label className={styles.select}>
              <Asset name="filter-5" />
              <select
                aria-label="Sort queue"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="longest">Sort: Longest Wait</option>
                <option value="shortest">Sort: Shortest Wait</option>
              </select>
              <Asset name="filter-3" />
            </label>
          </div>
          <div className={styles.pills} aria-label="Queue channel filters">
            {channelFilters.map((f) => (
              <button
                key={f.key}
                className={channel === f.key ? styles.pillActive : ''}
                aria-pressed={channel === f.key}
                onClick={() => setChannel(f.key)}
              >
                {f.asset && <Asset name={f.asset} />}
                {f.label}
                <span>{f.count}</span>
              </button>
            ))}
          </div>
        </Card>
        <div className={styles.split}>
          <Card className={styles.tableCard}>
            <div className={styles.tableScroll}>
              <table>
                <thead>
                  <tr>
                    <th>Customer &amp; identity</th>
                    <th>Channel / type</th>
                    <th>Issue &amp; case ID</th>
                    <th>Wait duration</th>
                    <th>Quick view</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((i) => {
                    const customer = state.customers.find((c) => c.id === i.customerId)!;
                    const record = state.cases.find((c) => c.id === i.caseId)!;
                    const owner = state.agents.find((a) => a.id === record.ownerId);
                    return (
                      <tr key={i.id} className={i.id === selected?.id ? styles.selectedRow : ''}>
                        <td>
                          <div className={styles.identity}>
                            <CustomerAvatar customer={customer} />
                            <div>
                              <button
                                className={styles.customerName}
                                onClick={() => dispatch({ type: 'select', id: i.id })}
                              >
                                {customer.name}
                              </button>
                              <small>#{customer.id}</small>
                              <small>{customer.plan}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className={styles.channel}>
                            <span
                              className={`${styles.channelIcon} ${i.channel === 'Email' ? styles.purple : i.channel === 'Chat' ? styles.mint : record.priority === 'Urgent' ? styles.rose : ''}`}
                            >
                              <Asset
                                name={
                                  record.priority === 'Urgent'
                                    ? 'queue-4'
                                    : i.channel === 'Voice'
                                      ? 'queue-6'
                                      : i.channel === 'Chat'
                                        ? 'queue-7'
                                        : 'queue-8'
                                }
                              />
                            </span>
                            <div>
                              <strong>
                                {record.priority === 'Urgent'
                                  ? 'VIP Hotline'
                                  : i.channel === 'Voice'
                                    ? 'Voice Inbound'
                                    : i.channel === 'Chat'
                                      ? 'Web Chat'
                                      : 'Email Support'}
                              </strong>
                              <span
                                className={
                                  record.priority === 'Urgent'
                                    ? styles.red
                                    : record.priority === 'High'
                                      ? styles.amber
                                      : styles.muted
                                }
                              >
                                {record.status === 'Escalated'
                                  ? 'Escalated'
                                  : `${record.priority} Priority`}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Link className={styles.issue} to={`/cases/${record.id}`}>
                            {record.title}
                          </Link>
                          <small>
                            #{record.id} · {record.category}
                          </small>
                        </td>
                        <td>
                          <strong
                            className={`${styles.wait} ${i.waitSeconds > 480 ? styles.red : i.waitSeconds > 240 ? styles.amber : styles.green}`}
                          >
                            {waitTime(i.waitSeconds)}
                          </strong>
                          <Badge
                            tone={
                              i.waitSeconds > 480 ? 'red' : i.waitSeconds > 240 ? 'amber' : 'green'
                            }
                          >
                            {i.waitSeconds > 480
                              ? 'SLA BREACH'
                              : i.waitSeconds > 240
                                ? 'HIGH WAIT'
                                : 'OPTIMAL'}
                          </Badge>
                        </td>
                        <td>
                          <div className={styles.quick}>
                            <small>
                              {owner?.id === state.currentAgentId
                                ? 'Assigned: You'
                                : (owner?.name ?? 'Unassigned')}
                            </small>
                            <button
                              className={styles.view}
                              aria-label={`Preview ${customer.name}`}
                              aria-pressed={i.id === selected?.id}
                              onClick={() => dispatch({ type: 'select', id: i.id })}
                            >
                              <Asset name="queue-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!entries.length && (
                <EmptyState
                  title="No matching work"
                  detail="Try a different search or clear your filters."
                />
              )}
            </div>
            <footer className={styles.tableFooter}>
              <span role="status">
                Showing <strong>{entries.length}</strong> of <strong>{queue.length}</strong> queue
                items
              </span>
              <Badge tone="neutral">Sample data</Badge>
            </footer>
          </Card>
          {selected && selectedCase && selectedCustomer && (
            <Card className={styles.preview} data-node-id="8:441">
              <div className={styles.previewHeading}>
                <span>
                  <i />
                  Active queue focus
                </span>
                <Badge tone={priorityTone(selectedCase.priority)}>
                  {selectedCase.priority} Priority
                </Badge>
              </div>
              <div className={styles.previewIdentity}>
                <CustomerAvatar customer={selectedCustomer} preview />
                <div>
                  <h2>{selectedCustomer.name}</h2>
                  <p>
                    #{selectedCustomer.id} · {selectedCustomer.company}
                  </p>
                  <div>
                    <Badge>{selectedCustomer.plan}</Badge>
                    <Badge tone={selectedCustomer.verified ? 'green' : 'amber'}>
                      {selectedCustomer.verified ? 'Verified' : 'Not verified'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className={styles.spec}>
                <span>Case specification</span>
                <Link to={`/cases/${selectedCase.id}`}>#{selectedCase.id}</Link>
              </div>
              <div className={styles.caseSummary}>
                <h3>{selectedCase.title}</h3>
                <p>{selectedCase.description}</p>
              </div>
              <div className={styles.previewStats}>
                <div>
                  <span>Queue Wait Time</span>
                  <strong className={selected.waitSeconds > 480 ? styles.red : ''}>
                    {waitTime(selected.waitSeconds)}
                  </strong>
                  <small>
                    {selected.waitSeconds > 480 ? 'Over target SLA' : 'Within sample queue'}
                  </small>
                </div>
                <div>
                  <span>Assigned Specialist</span>
                  <strong>
                    {state.agents.find((a) => a.id === selectedCase.ownerId)?.name ?? 'Unassigned'}
                  </strong>
                  <small>{selectedCase.status}</small>
                </div>
              </div>
              <div className={styles.contacts}>
                <p>
                  <Asset name="preview-2" />
                  {selectedCustomer.email}
                </p>
                <p>
                  <Asset name="preview-3" />
                  {selectedCustomer.phone}
                </p>
              </div>
              <Link className={styles.launch} to={`/workspace/${selected.id}`}>
                <Asset name="preview-4" />
                Open interaction
              </Link>
              <div className={styles.previewActions}>
                <Button
                  variant="secondary"
                  disabled
                  title="Transfers will be enabled with the case workflow"
                >
                  <Asset name="preview-5" />
                  Transfer Ticket
                </Button>
                <Link to={`/customers/${selectedCustomer.id}`}>
                  <Asset name="preview-6" />
                  CRM Profile
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
      {refreshed && (
        <div className={styles.feedback} role="status">
          Sample queue refreshed.
        </div>
      )}
    </>
  );
}
