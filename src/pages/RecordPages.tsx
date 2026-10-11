import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useApp } from '../state/AppProvider';
import { Badge, Card, EmptyState } from '../components/ui';
import PageHeading from '../components/PageHeading';
import { CustomerAvatar, priorityTone } from './QueuePage';
import styles from './RecordPages.module.css';
export function WorkspacePage() {
  const { interactionId } = useParams();
  const { state, dispatch } = useApp();
  const interaction = state.interactions.find((i) => i.id === interactionId);
  useEffect(() => {
    if (interaction) dispatch({ type: 'select', id: interaction.id });
  }, [interaction?.id, dispatch]);
  if (!interaction) return <MissingRecord />;
  const customer = state.customers.find((c) => c.id === interaction.customerId)!;
  const record = state.cases.find((c) => c.id === interaction.caseId)!;
  return (
    <div className={styles.page}>
      <PageHeading title="Call Center Workspace" breadcrumb="Live Workspace">
        <Badge tone="green">Demo interaction</Badge>
        <Link className={styles.linkButton} to="/queue">
          Return to queue
        </Link>
      </PageHeading>
      <div className={styles.workspace}>
        <Card className={styles.panel}>
          <h2>Waiting work queue</h2>
          <div className={styles.stack}>
            {state.interactions
              .filter((i) => i.status !== 'Ended')
              .map((i) => {
                const c = state.customers.find((c) => c.id === i.customerId)!;
                const r = state.cases.find((c) => c.id === i.caseId)!;
                return (
                  <Link
                    key={i.id}
                    className={`${styles.workItem} ${i.id === interaction.id ? styles.selected : ''}`}
                    to={`/workspace/${i.id}`}
                  >
                    <div>
                      <strong>{c.name}</strong>
                      <Badge tone={priorityTone(r.priority)}>{r.priority}</Badge>
                    </div>
                    <span>{r.title}</span>
                    <small>
                      #{r.id} · {i.channel}
                    </small>
                  </Link>
                );
              })}
          </div>
        </Card>
        <div className={styles.stack}>
          <Card className={styles.panel}>
            <div className={styles.panelHeading}>
              <Badge>{interaction.channel}</Badge>
              <Badge tone="amber">{interaction.status}</Badge>
            </div>
            <h2>{customer.name}</h2>
            <p className={styles.subtle}>
              #{record.id} · {record.title}
            </p>
            <hr />
            <h3>Customer question</h3>
            {interaction.messages.map((message) => (
              <div className={styles.message} key={message.id}>
                <strong>{message.author}</strong>
                <p>{message.body}</p>
              </div>
            ))}
          </Card>
          {state.assistEnabled && (
            <Card className={`${styles.panel} ${styles.assist}`}>
              <Badge tone="amber">Sample copilot guidance</Badge>
              <h3>Review before responding</h3>
              <p>{record.description}</p>
              <Link to="/knowledge">Browse knowledge articles →</Link>
            </Card>
          )}
        </div>
        <Card className={styles.panel}>
          <div className={styles.customerHeading}>
            <CustomerAvatar customer={customer} />
            <div>
              <h2>{customer.name}</h2>
              <p className={styles.subtle}>#{customer.id}</p>
            </div>
          </div>
          <Badge tone={customer.verified ? 'green' : 'amber'}>
            {customer.verified ? 'Verified customer' : 'Not verified'}
          </Badge>
          <dl>
            <dt>Email</dt>
            <dd>{customer.email}</dd>
            <dt>Phone</dt>
            <dd>{customer.phone}</dd>
            <dt>Account plan</dt>
            <dd>{customer.plan}</dd>
            <dt>Case status</dt>
            <dd>{record.status}</dd>
            <dt>Assigned owner</dt>
            <dd>{state.agents.find((a) => a.id === record.ownerId)?.name ?? 'Unassigned'}</dd>
          </dl>
          <Link className={styles.textLink} to={`/customers/${customer.id}`}>
            Open customer profile →
          </Link>
          <Link className={styles.textLink} to={`/cases/${record.id}`}>
            Open related case →
          </Link>
        </Card>
      </div>
    </div>
  );
}
export function CustomersPage() {
  const { customerId } = useParams();
  const { state } = useApp();
  const customers = customerId
    ? state.customers.filter((c) => c.id === customerId)
    : state.customers;
  if (!customers.length) return <MissingRecord />;
  return (
    <div className={styles.page}>
      <PageHeading
        title={customerId ? customers[0].name : 'Customer Directory'}
        breadcrumb="Customers (CRM)"
      >
        <Badge>
          {customers.length} {customerId ? 'customer' : 'customers'}
        </Badge>
      </PageHeading>
      <div className={styles.grid}>
        {customers.map((customer) => (
          <Card key={customer.id} className={styles.panel}>
            <div className={styles.customerHeading}>
              <CustomerAvatar customer={customer} />
              <div>
                <h2>{customer.name}</h2>
                <p className={styles.subtle}>
                  #{customer.id} · {customer.company}
                </p>
              </div>
            </div>
            <Badge tone={customer.verified ? 'green' : 'amber'}>
              {customer.verified ? 'Verified' : 'Not verified'}
            </Badge>
            <dl>
              <dt>Email</dt>
              <dd>{customer.email}</dd>
              <dt>Phone</dt>
              <dd>{customer.phone}</dd>
              <dt>Account plan</dt>
              <dd>{customer.plan}</dd>
            </dl>
            <h3>Related cases</h3>
            {state.cases
              .filter((c) => c.customerId === customer.id)
              .map((c) => (
                <Link className={styles.recordLink} key={c.id} to={`/cases/${c.id}`}>
                  <strong>#{c.id}</strong>
                  <span>{c.title}</span>
                  <Badge tone={priorityTone(c.priority)}>{c.priority}</Badge>
                </Link>
              ))}
            {!customerId && (
              <Link className={styles.textLink} to={`/customers/${customer.id}`}>
                Open profile →
              </Link>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
export function CasesPage() {
  const { caseId } = useParams();
  const { state } = useApp();
  const records = caseId ? state.cases.filter((c) => c.id === caseId) : state.cases;
  if (!records.length) return <MissingRecord />;
  return (
    <div className={styles.page}>
      <PageHeading
        title={caseId ? `Case ${caseId}` : 'Cases & Tickets Console'}
        breadcrumb="Cases & Tickets"
      >
        <Badge>
          {records.length} {caseId ? 'case' : 'cases'}
        </Badge>
      </PageHeading>
      <div className={styles.grid}>
        {records.map((record) => {
          const customer = state.customers.find((c) => c.id === record.customerId)!;
          const interaction = state.interactions.find((i) => i.caseId === record.id);
          return (
            <Card key={record.id} className={styles.panel}>
              <div className={styles.panelHeading}>
                <Link className={styles.textLink} to={`/cases/${record.id}`}>
                  #{record.id}
                </Link>
                <Badge tone={priorityTone(record.priority)}>{record.priority}</Badge>
              </div>
              <h2>{record.title}</h2>
              <p className={styles.body}>{record.description}</p>
              <dl>
                <dt>Customer</dt>
                <dd>
                  <Link to={`/customers/${customer.id}`}>{customer.name} →</Link>
                </dd>
                <dt>Status</dt>
                <dd>{record.status}</dd>
                <dt>Owner</dt>
                <dd>{state.agents.find((a) => a.id === record.ownerId)?.name ?? 'Unassigned'}</dd>
                <dt>Category</dt>
                <dd>{record.category}</dd>
              </dl>
              {interaction && (
                <Link className={styles.linkButton} to={`/workspace/${interaction.id}`}>
                  Open interaction
                </Link>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
export function FollowUpsPage() {
  const { state } = useApp();
  return (
    <div className={styles.page}>
      <PageHeading title="Follow-ups & Reminders" breadcrumb="Follow-ups">
        <Badge tone="amber">{state.followUps.filter((f) => !f.completed).length} pending</Badge>
      </PageHeading>
      <div className={styles.grid}>
        {state.followUps.map((task) => {
          const record = state.cases.find((c) => c.id === task.caseId)!;
          const customer = state.customers.find((c) => c.id === record.customerId)!;
          return (
            <Card className={styles.panel} key={task.id}>
              <div className={styles.panelHeading}>
                <Badge>
                  {task.channel === 'Voice' ? 'Phone callback' : `${task.channel} reply`}
                </Badge>
                <Badge tone={new Date(task.dueAt) < new Date() ? 'red' : 'amber'}>
                  {new Date(task.dueAt) < new Date() ? 'Overdue' : 'Scheduled'}
                </Badge>
              </div>
              <h2>{task.title}</h2>
              <p className={styles.subtle}>
                {customer.name} · #{record.id}
              </p>
              <dl>
                <dt>Due date · Asia/Kolkata</dt>
                <dd>
                  {new Intl.DateTimeFormat('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    timeZone: 'Asia/Kolkata',
                  }).format(new Date(task.dueAt))}
                </dd>
                <dt>Owner</dt>
                <dd>{state.agents.find((a) => a.id === task.ownerId)?.name}</dd>
              </dl>
              <Link className={styles.textLink} to={`/cases/${record.id}`}>
                Open related case →
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
export function KnowledgePage() {
  const { state } = useApp();
  return (
    <div className={styles.page}>
      <PageHeading title="Knowledge Base" breadcrumb="Knowledge Base">
        <Badge>{state.knowledge.length} articles</Badge>
      </PageHeading>
      <div className={styles.grid}>
        {state.knowledge.map((article) => (
          <Card className={styles.panel} key={article.id}>
            <Badge>{article.category}</Badge>
            <h2>{article.title}</h2>
            <p className={styles.body}>{article.answer}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
export function SupervisorPage() {
  const { state } = useApp();
  return (
    <div className={styles.page}>
      <PageHeading title="Supervisor Operations" breadcrumb="Supervisor View">
        <Badge>Sample team overview</Badge>
      </PageHeading>
      <div className={styles.summary}>
        <Card className={styles.panel}>
          <span className={styles.subtle}>Available agents</span>
          <strong>{state.agents.filter((a) => a.availability === 'Ready').length}</strong>
        </Card>
        <Card className={styles.panel}>
          <span className={styles.subtle}>Waiting work</span>
          <strong>{state.interactions.filter((i) => i.status === 'Waiting').length}</strong>
        </Card>
        <Card className={styles.panel}>
          <span className={styles.subtle}>Pending approvals</span>
          <strong>{state.approvals.filter((a) => a.status === 'Pending').length}</strong>
        </Card>
      </div>
      <Card className={styles.panel}>
        <h2>Team availability</h2>
        <div className={styles.grid}>
          {state.agents.map((agent) => (
            <div className={styles.agentCard} key={agent.id}>
              <div className={styles.agentAvatar}>{agent.initials}</div>
              <div>
                <strong>{agent.name}</strong>
                <p>{agent.team}</p>
                <small>
                  {
                    state.cases.filter((c) => c.ownerId === agent.id && c.status !== 'Resolved')
                      .length
                  }{' '}
                  assigned cases
                </small>
              </div>
              <Badge
                tone={
                  agent.availability === 'Ready'
                    ? 'green'
                    : agent.availability === 'Busy'
                      ? 'red'
                      : 'neutral'
                }
              >
                {agent.availability}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
export function MissingRecord() {
  return (
    <div className={styles.page}>
      <Card>
        <EmptyState
          title="Record not found"
          detail="The requested record is not in this demo. Return to the queue to select available work."
        />
        <Link className={styles.back} to="/queue">
          Return to queue
        </Link>
      </Card>
    </div>
  );
}
